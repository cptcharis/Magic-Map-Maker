import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import type { TreeNode } from '../types';

interface TreeViewProps {
  data: TreeNode;
  theme: string;
}

const TreeView = forwardRef<{ exportPNG: () => void }, TreeViewProps>(({ data, theme }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<d3.HierarchyNode<TreeNode> | null>(null);

  useImperativeHandle(ref, () => ({
    exportPNG: () => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      
      const { width, height } = svg.getBoundingClientRect();

      const svgString = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      canvas.width = width * 2; 
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();
      ctx.fillStyle = `rgb(${surfaceColor})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'magic-map.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      img.src = url;
    },
  }));
  
  const draw = (initialDraw = false) => {
    if (!rootRef.current || !svgRef.current || !containerRef.current) return;

    const root = rootRef.current;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    svg.attr('width', width).attr('height', height);

    if (initialDraw) {
      svg.selectAll('*').remove();
    }
    
    const g = initialDraw ? svg.append('g') : svg.select<SVGGElement>('g');
    if (g.empty()) return;

    // Add SVG filter for sketchbook theme
    if (initialDraw && theme === 'sketchbook') {
        const defs = svg.append('defs');
        const filter = defs.append('filter').attr('id', 'sketchy');
        filter.append('feTurbulence')
            .attr('type', 'fractalNoise')
            .attr('baseFrequency', '0.05')
            .attr('numOctaves', '3')
            .attr('result', 'noise');
        filter.append('feDisplacementMap')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'noise')
            .attr('scale', '4');
    }
    
    const nodeSize = { width: 200, height: 60 };
    const treeLayout = d3.tree().nodeSize([nodeSize.height + 20, nodeSize.width]);
    treeLayout(root);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const rootColor = '#8A2BE2'; 
    const duration = 500;

    const nodes = root.descendants();
    const links = root.links();
    
    // --- LINKS ---
    const linkSelection = g.selectAll('path.link').data(links, (d: any) => d.target.id);
    
    const linkEnter = linkSelection.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', 'rgb(var(--color-border))')
        .attr('stroke-width', 2.5)
        .attr('filter', theme === 'sketchbook' ? 'url(#sketchy)' : null)
        .attr('d', d3.linkHorizontal<any, d3.HierarchyPointNode<TreeNode>>().x(d => d.y).y(d => d.x));

     if (initialDraw) {
        linkEnter.each(function() {
            const path = this as SVGPathElement;
            const totalLength = path.getTotalLength();
            d3.select(path)
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition().duration(duration).delay((d, i) => i * 50).attr('stroke-dashoffset', 0);
        });
     }
        
    linkSelection.transition().duration(duration)
        .attr('d', d3.linkHorizontal<any, d3.HierarchyPointNode<TreeNode>>().x(d => d.y).y(d => d.x));
        
    linkSelection.exit().remove();


    // --- NODES ---
    const nodeSelection = g.selectAll('g.node').data(nodes, (d: any) => d.id);

    const nodeEnter = nodeSelection.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${(d as any).y},${(d as any).x})`)
        .on('click', (event, d: any) => {
            if (d.children || d._children) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                rootRef.current = d3.hierarchy(data); // Re-create hierarchy to reflect changes
                draw();
            }
        });

    nodeEnter.append('circle')
        .attr('r', 0)
        .attr('fill', d => !(d as any).children && (d as any)._children ? '#ccc' : (d.depth === 0 ? rootColor : colorScale((d.depth - 1).toString())))
        .attr('stroke', 'rgb(var(--color-surface))')
        .attr('stroke-width', 3)
        .style('cursor', d => d.children || (d as any)._children ? 'pointer' : 'default')
        .style('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))')
        .transition().duration(duration).ease(d3.easeElasticOut).delay((d,i) => initialDraw ? i * 50 + duration / 2 : 0)
        .attr('r', d => d.depth === 0 ? 20 : 15);

    const textEnter = nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => (d.depth === 0 || d.children ? -25 : 25))
        .attr('text-anchor', d => (d.depth === 0 || d.children ? 'end' : 'start'))
        .attr('font-family', "var(--font-main, 'Nunito', sans-serif)")
        .attr('font-weight', 'bold')
        .attr('font-size', d => d.depth === 0 ? '18px' : '16px')
        .attr('fill', 'rgb(var(--color-text-main))')
        .style('opacity', 0);
        
    textEnter.append('tspan').text(d => d.data.emoji);
    textEnter.append('tspan').attr('dx', '0.5em').text(d => d.data.name);
    textEnter.clone(true).lower().attr('stroke-linejoin', 'round').attr('stroke-width', 3).attr('stroke', 'rgb(var(--color-surface))');
    textEnter.transition().duration(duration).delay((d,i) => initialDraw ? i * 50 + duration / 1.5 : 0).style('opacity', 1);

    const nodeUpdate = nodeSelection.transition().duration(duration)
        .attr('transform', d => `translate(${(d as any).y},${(d as any).x})`);
    
    nodeUpdate.select('circle')
        .attr('fill', d => !(d as any).children && (d as any)._children ? '#ccc' : (d.depth === 0 ? rootColor : colorScale((d.depth - 1).toString())))
        .attr('r', d => d.depth === 0 ? 20 : 15);
        
    nodeSelection.exit().remove();
    
    if (initialDraw) {
        const bounds = (g.node() as SVGGElement).getBBox();
        const scale = Math.min(1, Math.min(width / bounds.width, height / bounds.height) * 0.9);
        const midX = bounds.x + bounds.width / 2;
        const midY = bounds.y + bounds.height / 2;
        
        const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => g.attr('transform', event.transform));
        svg.call(zoom);
        
        const initialTransform = d3.zoomIdentity.translate(width / 2 - scale * midX, height / 2 - scale * midY).scale(scale);
        svg.transition().duration(duration).call(zoom.transform, initialTransform);
    }
  };
  
  useEffect(() => {
    if (data) {
        rootRef.current = d3.hierarchy(data);
        // Assign a stable, unique ID to each node to prevent rendering issues
        rootRef.current.descendants().forEach((d: any, i: number) => {
            d.id = i; 
        });
        draw(true);
    }
  }, [data, theme]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <svg ref={svgRef}></svg>
    </div>
  );
});

export default TreeView;