export interface FilesTreeNode {
    name: string;
    children?: FilesTreeNode[] | null;
}

export type FilesTree = FilesTreeNode[]; 
