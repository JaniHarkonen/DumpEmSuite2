import { DropAreaSettings } from "@renderer/components/DropArea/DropArea";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";

type OnDrop = (dropArea: DropAreaSettings) => void;

type Props = {
  dropAreas: DropAreaSettings[];
  onDrop?: OnDrop;
};

type Returns = {
  handleDropAreaHighlight: (e: MouseEvent<HTMLDivElement>) => void;
  handleContentDrop: () => void;
  setActiveDropArea: Dispatch<SetStateAction<DropAreaSettings | null>>;
  activeDropArea: DropAreaSettings | null;
};

export default function useDropAreas(props: Props): Returns {
  const pDropAreas: DropAreaSettings[] = props.dropAreas;
  const pOnDrop: OnDrop = props.onDrop || function() {};
  const [activeDropArea, setActiveDropArea] = useState<DropAreaSettings | null>(null);

  const handleDropAreaHighlight = (e: MouseEvent<HTMLDivElement>) => {
    const {x, y, width, height} = e.currentTarget.getBoundingClientRect();
    const mx: number = e.clientX - x;
    const my: number = e.clientY - y;

    for( let dropArea of pDropAreas ) {
      const {activation} = dropArea;
      if( 
        mx >= activation.left(width) && 
        mx < width - activation.right(width) && 
        my >= activation.top(height) && 
        my < height - activation.bottom(height) 
      ) {
        setActiveDropArea(dropArea);
      }
    }
  };

  const handleContentDrop = () => {
    if( activeDropArea ) {
      pOnDrop(activeDropArea);
    }
  };

  return {
    handleDropAreaHighlight,
    handleContentDrop,
    setActiveDropArea,
    activeDropArea
  };
}
