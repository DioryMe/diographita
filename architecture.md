# Diographita Application Architecture

## Overview

Diographita is an Electron-based desktop application for managing and exploring diories (diary entries with multimedia content). The application consists of three main sections: My Diory, Archives, and Settings, with a robust Redux-based state management system.

## Dictionary

### Core Terms

- **Diory**: A diary entry containing text, images, dates, locations, and metadata
- **Diograph**: A collection of interconnected diories forming a narrative structure
- **Story**: A linked sequence of diories forming a narrative thread
- **Focus**: The current context or perspective within the diograph navigation

### My Diory Terms

- **Diory in Focus**: The currently selected diory that serves as the navigation context
- **Selected StoryDiory**: The currently highlighted diory within the grid view
- **StoryDiory**: Any diory that belongs to the stories collection of the diory in focus
- **Root Diory**: The top-level diory with id "/" that serves as the entry point
- **Focus Navigation**: The act of changing the diory in focus, which updates the context and available stories

### Archive Terms

- **Archive**: A read-only collection of filtered diories from external diograph sources
- **Archive Room**: A configured path to an external diograph that can be searched
- **Archive Filter**: Search criteria used to determine which diories appear in the archive grid
- **Archive Grid**: The main view showing filtered archive diories in a grid layout

### UI Terms

- **Home View**: The initial My Diory page showing storyDiories of the root diory
- **Grid View**: A layout displaying multiple diories in a grid format with one enlarged
- **Content View**: A detailed view of a single diory's content and metadata
- **Modal Overlay**: A popup interface that appears on top of existing content

## Store Architecture

### Current Store Structure

The application uses Redux Toolkit with a centralized store managing two main slices:

```typescript
// Root Store
interface RootState {
  diory: DioryState;
  archive: ArchiveState;
}
```

### My Diory State

```typescript
interface DioryState {
  focus: {
    focusDiory: IDioryObject | null; // The diory currently in focus
    storyDiory: IDioryObject | null; // Currently selected story diory
    focusId: string | null; // ID of the diory in focus
    storyId: string | null; // ID of selected story diory
    storyDiories: IDioryObject[]; // All stories of the diory in focus
    prevId: string | null; // Previous diory for navigation
    nextId: string | null; // Next diory for navigation
    stories: IDioryObject[]; // Stories collection (same as storyDiories)
    CID: string | null; // Content identifier
    mimeType: string | null; // Content type
  };
  loading: boolean; // Loading state for async operations
  error: string | null; // Error state
}
```

**Key Actions for My Diory:**

- `fetchDioryInfo(focusId, storyId?)`: Fetches diory information and updates focus
- `setFocus(focusId, storyId?)`: Synchronously updates focus state with fetched diory info
- `selectStory(storyId)`: Sets the selected story diory
- **My Diory Navigation Flow:**

1. **Home → Grid**: `fetchDioryInfo(clickedStoryId)` sets new focus
2. **Grid Selection**: `setFocus(clickedStoryDioryId, currentStoryId)` updates selected storyDiory
3. **Grid → Content**: Navigate to content view with current focus and story (either clicking enlarged image or selected storyDiory again)
4. **Change story for current storyDiory**: Select new story from top, `setFocus(currentStoryDioryId, clickedStoryId)`

### Archive State

```typescript
interface ArchiveState {
  filter: IDioryDateGeoSearchProps; // Current search filter
  archiveDiories: IDioryObject[]; // Filtered diories from archives
  selectedDiory: IDioryObject | null; // Currently selected archive diory
  loading: boolean; // Loading state for fetch operations
  error: string | null; // Error state
  isOverlayOpen: boolean; // Controls archive content overlay
}

interface IDioryDateGeoSearchProps {
  dateFrom?: string;
  dateTo?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  text?: string;
}
```

**Key Actions for Archive:**

- `fetchArchiveDiories(filter)`: Fetches filtered diories from archive rooms
- `setFilter(filter)`: Updates the archive filter completely or partially
- `selectArchiveDiory(diory)`: Sets selected diory and opens overlay
- `closeArchiveOverlay()`: Closes overlay and clears selection

## URL Structure

### My Diory Routes

- `/my-diory` → MyDioryHome (shows storyDiories of root diory "/")
- `/my-diory/:dioryId/grid?storyId=:storyId` → MyDioryGrid
- `/my-diory/:dioryId/content?storyId=:storyId` → MyDioryContent

**Route Parameters:**

- `dioryId`: The ID of the diory in focus
- `storyId` (query param): The ID of the selected story

### Archive Routes

- `/archives` → ArchiveGrid (shows filtered archive diories)
- `/archives?overlay=:dioryId` → ArchiveGrid + ArchiveContent overlay

**Route Parameters:**

- `overlay` (query param): The ID of the diory to show in overlay mode

## Component Architecture

### My Diory Components

#### MyDioryHome

- **Purpose**: Entry point showing stories of root diory
- **Data Source**: `storyDiories` from store (when `focusId === "/"`)
- **Actions**: Click → navigate to `/my-diory/:clickedDioryId/grid`
- **Store Interaction**: Uses existing `fetchDioryInfo("/")` on mount

#### MyDioryGrid

- **Purpose**: Grid view with enlarged selected story
- **Header**: Shows diory in focus name + story dropdown
- **Data Source**: `focus.focusDiory`, `focus.storyDiories`, `focus.storyDiory`
- **Actions**:
  - Story selection → update `storyId` in URL and store
  - Enlarged image click → navigate to content view
  - Grid diory click → `fetchDioryInfo(clickedDioryId)` for new focus
- **Store Interaction**: Responds to route params, updates selection

#### MyDioryContent

- **Purpose**: Detailed diory content view
- **Data Source**: `focus.storyDiory` (or `focus.focusDiory` if no story selected)
- **Components**: Uses existing `DioryContent` and `DioryInfo`
- **Store Interaction**: Read-only display of current focus/story

### Archive Components

#### ArchiveGrid

- **Purpose**: Shows filtered archive diories with filter controls
- **Header**: Filter definition display + "Edit" button (placeholder)
- **Data Source**: `archiveDiories` from archive slice
- **Actions**: Diory click → open overlay with selected diory
- **Store Interaction**: `fetchArchiveDiories(filter)` on mount and filter changes

#### ArchiveContent (Overlay)

- **Purpose**: Modal overlay showing selected archive diory
- **Display**: Enlarged diory image + close button
- **Data Source**: `selectedDiory` from archive slice
- **Actions**: Close button → clear selection and close overlay
- **Store Interaction**: Updates overlay state and selection

## State Management Patterns

### My Diory State Flow

```
1. Home: fetchDioryInfo("/") → loads root diory stories
2. Click story → navigate to /my-diory/:storyId/grid
3. Grid: fetchDioryInfo(storyId) → sets new focus
4. Select story → setFocus(focusId, storyId) → updates selection
5. Click enlarged → navigate to /my-diory/:focusId/content?storyId=:storyId
6. Click story in grid → fetchDioryInfo(clickedId) → new focus cycle
```

### Archive State Flow

```
1. Grid: fetchArchiveDiories(filter) → loads filtered results
2. Click diory → selectArchiveDiory(diory) → opens overlay
3. Close overlay → closeArchiveOverlay() → back to grid
4. Edit filter → updateFilter(changes) → refetch results
```

## Implementation Strategy

### Phase 1: Store Setup

1. Add archive slice to existing store
2. Create archive action creators and reducers
3. Update store configuration to include archive slice

### Phase 2: Route Integration

1. Update router to handle new URL patterns
2. Add route parameter parsing for dioryId and storyId
3. Implement navigation helpers for URL construction

### Phase 3: Component Updates

1. Modify My Diory components to use route parameters
2. Enhance Archive components with overlay functionality
3. Connect components to appropriate store slices

### Phase 4: State Synchronization

1. Ensure URL and store state stay synchronized
2. Handle browser back/forward navigation
3. Implement proper error handling and loading states

This architecture maintains the existing solid foundation while adding the necessary structure for the enhanced My Diory navigation and Archive overlay functionality.
