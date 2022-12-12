import { useEffect, useState } from "react";

interface Props {
    onChangeHandler: Function,
    grade: number
}

export default function StarSelector(data: Props) {
    const [grade, setGrade] = useState<number>( data.grade | 0);
    const [starsSelected, setStarsSelected] = useState<number>(0);
    // TODO set up a double click option to set the number of stars back to zero

    let handleClickStar = (stars: number) => {
        setStarsSelected(stars);
    }

    useEffect(() => {
        
    }, [grade]);

  return (
    <>
        {
            Array.from({length: starsSelected}, (_, x) => x+1).map( (i) => 
                <i selected-star={`${i}`} key={i} onClick={()=> handleClickStar(i)}></i>
            )
        }
        {
            Array.from({length: 5 - starsSelected}, (_, x) => starsSelected+x+1).map( (i) => 
                <i not-selected-star={`${i}`} key={i*10} onClick={()=> handleClickStar(i)}></i>
            )
        }
    </>
  )
}