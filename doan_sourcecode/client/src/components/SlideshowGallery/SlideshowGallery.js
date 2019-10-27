import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import classes from './SlideshowGallery.css';

const SlideshowGallery = React.forwardRef((props, ref) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const containerRef = useRef(null);
    const bottomContainerRef = useRef(null);
    const [automaticInterval, setAutomaticInterval] = useState(null);

    const ratioWHArray = props.ratio.split(":");
    const ratioWH = ratioWHArray[0] / ratioWHArray[1];
    
    const getNewSlideIndex = step => {
        const numberSlide = props.input.length;
        let newSlideIndex = slideIndex + step;

        if(newSlideIndex >= numberSlide) newSlideIndex = 0;
        if(newSlideIndex < 0) newSlideIndex = numberSlide - 1;

        return newSlideIndex;
    }

    const backward = () => {
        setSlideIndex(getNewSlideIndex(-1));
    }

    const forward = () => {
        setSlideIndex(getNewSlideIndex(1));
    }

    const updateDimension = () => {
        containerRef.current.style.height = `${containerRef.current.offsetWidth /
          ratioWH}px`;
        bottomContainerRef.current.style.height = `${bottomContainerRef.current
          .offsetWidth /
          props.input.length /
          ratioWH}px`;
    }

    const runAutomatic = () => {
        setSlideIndex(getNewSlideIndex(1))
    } 

    useImperativeHandle(
      ref,
      () => ({
        setSlideIdx(index){
          setSlideIndex(index);
        }
      }
    ));

    useEffect(() => {
        updateDimension();
        window.addEventListener('resize', updateDimension);

        if(props.mode === 'automatic'){
            const timeout = props.timeout || 5000;

            setAutomaticInterval(setInterval(
              () => runAutomatic(),
              Number.parseInt(timeout)
            ));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => {
            window.removeEventListener('resize', updateDimension);
            if (automaticInterval) clearInterval(automaticInterval);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div className={classes.lpSlideshowGallery}>
        <div className={classes.container} ref={containerRef}>
          {props.input.map((image, index) => {
            return (
              <div
                key={index}
                className={[
                  classes.slide,
                  slideIndex === index ? classes.active : ''
                ].join(' ')}
              >
                <div className={classes.numberText}>
                  {`${index + 1} / ${props.input.length}`}
                </div>
                <img className={classes.image} src={image} alt='' />
                <div className={classes.captionText}></div>
              </div>
            );
          })}

          <span className={classes.prev} onClick={backward}>
            ❮
          </span>
          <span className={classes.next} onClick={forward}>
            ❯
          </span>
        </div>

        <div className={classes.containerBottom} ref={bottomContainerRef} style={{
            width: `${props.input.length / 3 * 90}%`
        }}>
          {props.input.map((image, index) => {
            return (
              <img
                key={index}
                src={image}
                alt=''
                className={[
                  classes.image,
                  slideIndex === index ? classes.active : ''
                ].join(' ')}
                onClick={() => setSlideIndex(index)}
                style={{
                  width: `${(1 / props.input.length) * 100}%`,
                  height: `100%`
                }}
              />
            );
          })}
        </div>
      </div>
    );
})

export default SlideshowGallery
