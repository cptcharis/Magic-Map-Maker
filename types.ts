export interface TreeNode {
  name: string;
  emoji?: string;
  children?: TreeNode[];
}

export interface TimelineEvent {
    date: string;
    title: string;
    description: string;
    emoji?: string;
}

export interface StoryboardPanel {
    scene: number;
    description: string;
    emoji?: string;
}

export interface CharacterNode {
    name: string;
    description: string;
    emoji?: string;
}

export interface CharacterRelationship {
    source: string;
    target: string;
    description: string;
}

export interface CharacterWeb {
    characters: CharacterNode[];
    relationships: CharacterRelationship[];
}

export type VisualizationData = TreeNode | TimelineEvent[] | StoryboardPanel[] | CharacterWeb;
export type MapType = 'TreeView' | 'Timeline' | 'Storyboard' | 'CharacterWeb';