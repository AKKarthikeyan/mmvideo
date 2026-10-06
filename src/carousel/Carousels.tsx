import React from "react";
import {Composition} from "remotion";
import {CarouselComp, CData} from "./Carousel";
import zee from "../../public/carousel/zee/carousel.json";
import mdr from "../../public/carousel/mdr/carousel.json";
import irdai from "../../public/carousel/irdai/carousel.json";
import pb from "../../public/carousel/pb/carousel.json";
import anupam from "../../public/carousel/anupam/carousel.json";
import adani from "../../public/carousel/adani/carousel.json";
import welspun from "../../public/carousel/welspun/carousel.json";
import kpigreen from "../../public/carousel/kpigreen/carousel.json";
import shyam from "../../public/carousel/shyam/carousel.json";

const ALL = [zee, mdr, irdai, pb, anupam, welspun, adani, kpigreen, shyam] as unknown as CData[];
export const CarouselCompositions: React.FC = () => (
  <>{ALL.map((D) => <Composition key={D.id} id={`CAR-${D.id}`} component={CarouselComp as any} defaultProps={{D}} durationInFrames={D.slides.length} fps={1} width={1080} height={1350}/>)}</>
);
