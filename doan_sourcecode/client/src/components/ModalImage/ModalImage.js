import React, {useEffect, useRef} from 'react';
import classes from './ModalImage.css';

function ModalImage(props) {
    const ratioWHArray = props.ratio.split(":");
    const ratioWH = ratioWHArray[0] / ratioWHArray[1];
    const modalRef = useRef(null);
    const imageRef = useRef(null);

    const showModal = () => {
        modalRef.current.style.display = 'initial';
    }

    const hideModal = () => {
        modalRef.current.style.display = 'none';
    }

    const updateDimension = () => {
        imageRef.current.style.height = `${imageRef.offsetWidth / ratioWH}px`
    }

    useEffect(() => {
        updateDimension();
        window.addEventListener('resize', updateDimension)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => {
            window.removeEventListener('resize', updateDimension);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classes.lpModalImage}>
            <img
            className={classes.image}
            src={props.image}
            alt=""
            onClick={showModal}
            ref={imageRef}
            style={{
                width: `${props.length / 3 * 90}%`
            }}
            />

            <div className={classes.modal} ref={modalRef}>
            <span className={classes.close} onClick={hideModal}>×</span>
            <img 
                className={classes.modalContent}
                src={props.image} 
                alt=""
            />
            <div className={classes.caption}></div>
            </div>
        </div>
    )
}

export default ModalImage
