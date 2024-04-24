import { cn } from '@/lib/utils';
import { CaretUpDown, Cursor } from '@phosphor-icons/react/dist/ssr';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';




export const ImgHoverComparison = ({
    firstImageSrc,
    secondImageSrc,
    className,
    imageClassname,

    width, height
}: {
    firstImageSrc: string;
    secondImageSrc: string;
    className?: string;
    imageClassname?: string;

    width?: number;
    height?: number;
}) => {

    return <div

        className={cn(' group', className)}
        style={
            {
                // maxHeight: '250px',
                // height: height,
                // width: width,
                objectPosition: 'left top',
                ...width !== undefined && height !== undefined
                    ? { aspectRatio: width / height }
                    : {}
            }
        }
    >
        <img

            src={firstImageSrc}
            className={cn('rounded-2xl bottom-0 left-0  pointer-events-none group-hover:hidden absolute ', imageClassname)}
        />
        <img

            src={secondImageSrc}
            className={cn('rounded-2xl hidden bottom-0 pointer-events-none left-0  group-hover:inline-block absolute ', imageClassname)}
        />
        <div className='
        group-hover:hidden
        absolute top-1/2 left-2/3 transform -translate-x-2 -translate-y-1/ '>
            <div className='flex flex-col gap-1 items-start'>
                <Cursor size={32} weight='fill' className='fill-primary ' />
                <div className='bg-primary text-white rounded-lg px-2 shadow-md py-1'>Hover</div>
            </div>

        </div>


    </div>



};

