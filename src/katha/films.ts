// The Katha films registered as compositions KT-<id>. Data: public/katha/<id>/data.json (scripts/katha/build_film.py).
import {KData} from "./Film";
import gita from "../../public/katha/gita/data.json";
export const FILMS: KData[] = [gita as unknown as KData];
