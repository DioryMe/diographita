# Redux and IPC

Loads data to frontend and offers it to React components

## Context

Two different data sources and ways to browse.

## Comparison between My Diory and Archive

### Data

- **My Diory**: Rich and manually curated. Composed to stories. Metadata can be completed. Semantic linking.
- **Archive**: Only info parsed from the binary file (content ID, mime type, date, latlng)

### Content

Same functionality for both: Icon which indicates which type of content it is. If available, content can be loaded on-demand by clicking the icon. If not available, icon is disabled (=greyed out)

- **My Diory**: Content should be available for all the diories.
- **Archive**: Indication of what type of content is available. Disable if not available.

### Browsing

- **My Diory**: Root diory has chosen stories linked. Browsed by stories. Fullscreen with content. Flipping the card shows info field.
- **Archive**: Diories which are browsed one by one. No fullscreen, only thumb/image.

### Actions

- **My Diory**: CRUD stories and diories. Arrange diories in story.
- **Archive**: Copy diories to My Diory.

## My Diory

Pitää pystyä toteuttamaan myös tietokannassa

```ts
interface DioryState {
  diory: IDioryObject | null; // ???
  focusId: string | null;
  storyId: string | null; // currently selected story
  storyDiories: IDioryObject[]; // focusId's linked diories
  prevId: string; // previous diory in story
  nextId: string; // next diory in story
  stories: IDioryObject[]; // available stories which focusId is part of
  CID: string;
  mimeType: string;
}

// IPC endpoint in backend
// - async thunk returns DioryState data
const getDioryState: DioryState = (focusId, storyId?) => {
  const stories = getStories(focusId);
  const firstStoryId = stories[0] && stories[0].id;
  const newStoryId = storyId || firstStoryId;
  const storyDiories = getStoryDiories(storyId);
  const { prevId, nextId } = getPrevNext(newStoryId, focusId);

  return {
    focusId,
    storyId: newStoryId,
    storyDiories,
    prevId,
    nextId,
  };
};

const diorySlice = createSlice({
  name: "diory",
  initialState,
  reducers: {
    setFocus(
      state,
      action: PayloadAction<{ focusId: string; storyId?: string | null }>
    ) {
      // async thunk from IPC
      const newState = getDioryState(focusId, storyId);
      state = { ...state, ...newState };
    },
  },
});
```

## Archive

```ts
interface ArchiveState {
  dioryArray: IDioryObject[];
  archives: any[],
  filters: any[],
  sort: any[]
}
// => hakee aina minkä tahansa muuttuessa uudet dioryArrayhyn

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    setAll(),
    setArchives(),
    setSort(),
    setFilter(
      state,
      action: PayloadAction<{ focusId: string; storyId?: string | null }>
    ) {
      // async thunk from IPC
      const newState = getDioryState(focusId, storyId);
      state = { ...state, ...newState };
    },
    indicateMyDiory(dioryArray: ArchiveState["dioryArray"]) {
      // const result = IPC.indicateMyDiory(dioryArray)
      return [] // array of dioryId's in MyDiory
    }
  },
});
```

## Content

Content is available if cid is found from contentUrls.

Backend reads CIDMapping which has [cid]: [absolutePath] pairs. CID mapping is composed of individual room's CIDMappings which has `address` and [cid]: [relativePath] pairs.

```ts
interface ContentState {
  contentUrls: { [cid: string]: ContentInfo }
}

interface ContentInfo {
  cid: string
  url: string // app://...
  status: "not loaded" | "loading" | "fulfilled" | "rejected" | "cancelled"
  error?: any
}

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    loadContent(cid: string),
    getContentInfo(cid: string): ContentInfo {
      return {
        cid,
        url: `app://${cid}`,
        loaded: false,
        loadingState: null
      }
    }
  },
});
```

## JSON files / database

All the JSON file and IPC inputs and outputs are validated with Zod Schema. So if anything is loaded from JSON file or database it goes through ZOD schema which validates it and verifies the typing. Same thing when saving to .json file or database or sending to API.

## Questions

Q: Can you update the archive diograph? Can archive diory latlng and dates be updated/completed?
A: At least not in free mode. Otherwise, I don't know.

## What needs to be done?

1. Static data for My Diory where the diory state is composed
2. Static data for Archive where the archive state is composed
3. Frontend Redux which loads it data with AsyncThunk from backend. Three slices: diory, archive and "content" (first just static responses without network traffic)
4. Backend endpoint with IPC which AsyncThunk calls
5. Typings and zod-schemas which are used on both sides to verify the interface
   - Reading JSON-files (and database) also has schema which validates the type
6. Static content data and app protocol

## Use cases

1. Show My Diory grid
2. Show Archive grid
3. Show My Diory diory
4. Show Archive diory
5. Load and show content
