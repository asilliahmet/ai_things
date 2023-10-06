import { useMemo } from "react";

const SoftmaxVisualizer = (props= {
    ar: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1],
    color: "#000000",
    space: 0.8,
    w: 300,
    h: 60,
})=>{
    let {ar, color, space, w, h, ...rest} = props;

    const elemStylesheet = useMemo(()=>(`
    .softmaxVisualizer {
        width: ${w}px;
        height: ${h}px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .softmaxVisualizer > * {
        width: ${(w/ar.length) * space}px;
        height: ${h}px;
        border-radius: 5px;
        background-color: ${color};
        transform-origin: 50% 100%;
        transition: transform 0.5s ease-out;
        transform: scaleY(1);
    }
    `), []);

    let sum = 0;
    ar = ar.map( x => { if (x>0){sum+=x; return(x)} return(0)  }   );
    ar = ar.map( x => x/sum );
    return (
        <>
        <style>{elemStylesheet}</style>
        <div className="softmaxVisualizer" {...rest}>
            {ar.map((int, ind) => <div key={ind} style={{transform: `scaleY(${int})`}}  />)}
        </div>
    </>
    );
};

export default SoftmaxVisualizer;