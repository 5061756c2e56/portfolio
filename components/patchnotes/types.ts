export type PatchnoteMeta = {
    id: string;
    title: string;
    displayDate: string;
    fileDate: string;
    description: string;
};

export type Patchnote = PatchnoteMeta & { content: string };

export type SortOrder = 'newest' | 'oldest';
export type Lang = 'FR' | 'EN';