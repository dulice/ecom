import { MdOutlineStarHalf, MdStarOutline, MdStar } from 'react-icons/md'

const Rating = (props) => {

    const { rating } = props;
    return (
        <>
            <span>
                {
                   rating >= 1? <MdStar />:
                   rating >= 0.5 ? <MdOutlineStarHalf /> :
                    <MdStarOutline />
                }
            </span>
            <span>
                {
                   rating>= 2? <MdStar />:
                   rating>= 1.5 ? <MdOutlineStarHalf /> :
                    <MdStarOutline />
                }
            </span>
            <span>
                {
                   rating>= 3? <MdStar />:
                   rating>= 2.5 ? <MdOutlineStarHalf /> :
                    <MdStarOutline />
                }
            </span>
            <span>
                {
                   rating>= 4? <MdStar />:
                   rating>= 3.5 ? <MdOutlineStarHalf /> :
                    <MdStarOutline />
                }
            </span>
            <span>
                {
                   rating >= 5? <MdStar />:
                   rating >= 4.5 ? <MdOutlineStarHalf /> :
                    <MdStarOutline />
                }
            </span>
        </>
  )
}

export default Rating