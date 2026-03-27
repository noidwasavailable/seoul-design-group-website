type ImageWithMetaData = {
	src: ImageMetadata;
	filename: string;
	isLandscape: boolean;
	isPortrait: boolean;
};

// --- Grid placement with occupied-cell tracking ---
const DEFAULT_PHOTO_GRID_COL_COUNT = 4;
const DEFAULT_MINIMUM_BIG_PHOTO_COUNT = 3;

const fn = (
	images: ImageWithMetaData[],
	colCount: number = DEFAULT_PHOTO_GRID_COL_COUNT,
) => {
	const COLS = colCount;
	const ROWS = Math.ceil(
		(images.length + DEFAULT_MINIMUM_BIG_PHOTO_COUNT) / COLS,
	);
	const totalCells = ROWS * COLS;
	const bigPhotoCount = Math.max(0, totalCells - images.length);

	// Simulate CSS grid auto-placement to decide which images get col-span-2 / row-span-2.
	// We walk through images in order and, for each one, find the first unoccupied cell
	// (row-major, matching CSS grid's `grid-auto-flow: row` default). Then we decide
	// whether the image can be enlarged to fill extra cells without leaving unreachable gaps.

	const occupied: boolean[][] = Array.from({ length: ROWS }, () =>
		Array(COLS).fill(false),
	);

	/** Find the next unoccupied cell in row-major order. */
	function nextFreeCell(): [number, number] | null {
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				if (!occupied[r][c]) return [r, c];
			}
		}
		return null;
	}

	/** Mark a rectangular region as occupied. */
	function markOccupied(r: number, c: number, rSpan: number, cSpan: number) {
		for (let dr = 0; dr < rSpan; dr++) {
			for (let dc = 0; dc < cSpan; dc++) {
				occupied[r + dr][c + dc] = true;
			}
		}
	}

	/** Check if a rectangular region is entirely unoccupied and within bounds. */
	function regionFree(
		r: number,
		c: number,
		rSpan: number,
		cSpan: number,
	): boolean {
		if (r + rSpan > ROWS || c + cSpan > COLS) return false;
		for (let dr = 0; dr < rSpan; dr++) {
			for (let dc = 0; dc < cSpan; dc++) {
				if (occupied[r + dr][c + dc]) return false;
			}
		}
		return true;
	}

	const wideSet = new Set<number>();
	const tallSet = new Set<number>();
	let bigPlaced = 0;

	// Pre-select evenly-spaced image indices as candidates for enlargement
	const bigTargets = new Set<number>();
	if (bigPhotoCount > 0) {
		const step = images.length / bigPhotoCount;
		for (let k = 0; k < bigPhotoCount; k++) {
			bigTargets.add(Math.floor(k * step + step / 2));
		}
	}

	/** Try to place image i as a big photo. Returns true if placed. */
	function tryPlaceBig(
		i: number,
		r: number,
		c: number,
		preferWide: boolean,
	): boolean {
		const tryWide = () => {
			if (regionFree(r, c, 1, 2)) {
				wideSet.add(i);
				markOccupied(r, c, 1, 2);
				return true;
			}
			return false;
		};
		const tryTall = () => {
			if (regionFree(r, c, 2, 1)) {
				tallSet.add(i);
				markOccupied(r, c, 2, 1);
				return true;
			}
			return false;
		};

		if (preferWide) {
			return tryWide() || tryTall();
		} else {
			return tryTall() || tryWide();
		}
	}

	for (let i = 0; i < images.length; i++) {
		const cell = nextFreeCell();
		if (!cell) break;
		const [r, c] = cell;
		let placed = false;

		if (bigTargets.has(i)) {
			const preferWide = bigPlaced % 2 === 0;
			placed = tryPlaceBig(i, r, c, preferWide);
			if (placed) {
				bigPlaced++;
			}
		}

		if (!placed) {
			markOccupied(r, c, 1, 1);
		}
	}

	// Fit optimization pass: swap mismatched orientations
	const mismatchedWide = [...wideSet].filter((i) => images[i].isPortrait);
	const mismatchedTall = [...tallSet].filter((i) => images[i].isLandscape);

	const swapCount = Math.min(mismatchedWide.length, mismatchedTall.length);
	for (let k = 0; k < swapCount; k++) {
		const i = mismatchedWide[k];
		const j = mismatchedTall[k];
		const temp = images[i];
		images[i] = images[j];
		images[j] = temp;
	}
	return {
		wideSet,
		tallSet,
		COLS,
	};
};

export default fn;
