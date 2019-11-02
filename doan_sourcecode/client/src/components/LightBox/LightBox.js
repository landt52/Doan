import React, {useRef, useEffect} from 'react';
import classes from './LightBox.css';
import SlideshowGallery from '../SlideshowGallery/SlideshowGallery';

function LightBox(props) {
    const ratioWHArray = props.ratio.split(':');
    const ratioWH = ratioWHArray[0] / ratioWHArray[1];
    const slideshowGallery = useRef(null);
    const modalRef = useRef(null);
    const containerRef = useRef(null);

    const showModal = (index) => {
        slideshowGallery.current.setSlideIdx(index);
        modalRef.current.style.visibility = "visible";
    }

    const hideModal = () => {
        modalRef.current.style.visibility = "hidden";
    }

    const updateDimension = () => {
        const height = containerRef.current.offsetWidth / props.input.length / 3 / ratioWH;
        containerRef.current.style.height = `${height}px`;
    }

    useEffect(() => {
        updateDimension();
        window.addEventListener('resize', updateDimension);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => {
            window.removeEventListener('resize', updateDimension);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div className={classes.lpLightbox}>
        <div className={classes.container} ref={containerRef}>
          {props.input.map((image, index) => {
            return (
              <div
                key={index}
                className={classes.imageWrapper}
                style={{
                  height: `100%`
                }}
              >
                <img
                  className={classes.image}
                  src={image}
                  alt=''
                  onClick={() => showModal(index)}
                  style={{
                    width: `${(props.input.length / 3) * 90}%`
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className={classes.modal} ref={modalRef}>
          <span className={classes.close} onClick={hideModal}>
            ×
          </span>
          <div className={classes.modalContent}>
            <SlideshowGallery
              ref={slideshowGallery}
              input={props.input}
              ratio={props.ratio}
              mode={`manual`}
            />
          </div>
        </div>
      </div>
    );
}

export default LightBox
