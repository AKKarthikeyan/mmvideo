// The Katha films registered as compositions KT-<id>. Data: public/katha/<id>/data.json (scripts/katha/build_film.py).
import {KData} from "./Film";
import gita from "../../public/katha/gita/data.json";
import sura from "../../public/katha/sura/data.json";
import suraTa from "../../public/katha/sura/data-ta.json";
import suraHi from "../../public/katha/sura/data-hi.json";
export const FILMS: KData[] = [gita as unknown as KData, sura as unknown as KData, suraTa as unknown as KData, suraHi as unknown as KData];
