import { create } from 'zustand';
import type { Tag, TagCreateInput } from '@/utils/types';
import { tagAdapter } from '@/db/adapters';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  selectedTagId: string | null;
}

interface TagActions {
  // Data operations
  loadTags: (userId?: string) => Promise<void>;
  getTag: (id: string) => Tag | undefined;
  getTagByName: (name: string, userId?: string) => Tag | undefined;
  createTag: (input: TagCreateInput, userId?: string) => Promise<Tag>;
  updateTag: (id: string, updates: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  // Selection
  selectTag: (id: string | null) => void;

  // Reset
  reset: () => void;
}

const initialState: TagState = {
  tags: [],
  isLoading: false,
  error: null,
  selectedTagId: null,
};

export const useTagStore = create<TagState & TagActions>((set, get) => ({
  ...initialState,

  // Load all tags
  loadTags: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const tags = await tagAdapter.getAll(userId);
      tags.sort((a, b) => a.name.localeCompare(b.name));
      set({ tags, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load tags',
        isLoading: false,
      });
    }
  },

  // Get single tag
  getTag: (id: string) => {
    return get().tags.find((tag) => tag.id === id);
  },

  // Get tag by name
  getTagByName: (name: string, userId?: string) => {
    const tags = get().tags;
    const filtered = userId ? tags.filter((tag) => tag.userId === userId) : tags;
    return filtered.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
  },

  // Create tag
  createTag: async (input: TagCreateInput, userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Check if tag with same name already exists
      const existing = get().getTagByName(input.name, userId);
      if (existing) {
        throw new Error(`Tag with name "${input.name}" already exists`);
      }

      const tag = await tagAdapter.create(input, userId);
      set((state) => ({
        tags: [...state.tags, tag].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        isLoading: false,
      }));
      return tag;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create tag',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update tag
  updateTag: async (id: string, updates: Partial<Tag>) => {
    set({ isLoading: true, error: null });
    try {
      // If updating name, check for duplicates
      if (updates.name) {
        const currentTag = get().getTag(id);
        const userId = currentTag?.userId;
        const existing = get().getTagByName(updates.name, userId);
        if (existing && existing.id !== id) {
          throw new Error(`Tag with name "${updates.name}" already exists`);
        }
      }

      await tagAdapter.update(id, updates);
      set((state) => ({
        tags: state.tags
          .map((tag) => (tag.id === id ? { ...tag, ...updates } : tag))
          .sort((a, b) => a.name.localeCompare(b.name)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update tag',
        isLoading: false,
      });
    }
  },

  // Delete tag
  deleteTag: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await tagAdapter.delete(id);
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        selectedTagId:
          state.selectedTagId === id ? null : state.selectedTagId,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete tag',
        isLoading: false,
      });
    }
  },

  // Select tag
  selectTag: (id: string | null) => {
    set({ selectedTagId: id });
  },

  // Reset store
  reset: () => {
    set(initialState);
  },
}));

