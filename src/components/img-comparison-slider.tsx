import { cn } from '@/lib/utils';
import { CaretUpDown } from '@phosphor-icons/react/dist/ssr';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';




export const ImgComparisonSlider = ({
    firstImageSrc,
    secondImageSrc,
    className,
    imageClassname,

    width, height,
    showVideo = false
}: {
    firstImageSrc: string;
    secondImageSrc: string;
    className?: string;
    imageClassname?: string;

    width?: number;
    height?: number;
    showVideo?: boolean;
}) => {


    return (
        <ReactCompareSlider
            handle={
                <div className="h-full flex bg-white w-0.5 items-center flex-col justify-center">
                    <CaretUpDown size={32} className="rotate-90 rounded-sm p-1 bg-white" />
                </div>
            }
            className={cn('', className)}
            style={
                {
                    objectFit: 'contain', objectPosition: 'left top',
                    ...width !== undefined && height !== undefined
                        ? { aspectRatio: width / height }
                        : {}
                }
            }
            itemOne={
                <ReactCompareSliderImage
                    src={firstImageSrc}
                    className={imageClassname}
                />
            }
            itemTwo={



                !showVideo ? <ReactCompareSliderImage
                    src={secondImageSrc}
                    className={imageClassname} /> :
                    <video
                        muted
                        autoPlay
                        loop
                        playsInline
                        className={imageClassname}
                    >
                        <source
                            src={secondImageSrc}
                            type="video/mp4"

                            className={imageClassname}
                        />
                    </video>
            }
        />
    );
};

