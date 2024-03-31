export interface FilesTreeNode {
    name: string;
    id: number;
    children?: FilesTreeNode[] | null;
}

export type FilesTree = FilesTreeNode[]; 
