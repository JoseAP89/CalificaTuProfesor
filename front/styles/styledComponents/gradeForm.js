import styled from 'styled-components';

const GradeFormStyle = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
    padding: 60px 100px ;
    .section-title {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 1.4rem;
        color: blueviolet;
    }
    .slider-skill-box {
        margin-top: 20px;
    }
    .resenia {
        margin-top: 46px;
    }
    .text-area-box {
        margin-top: 12px;
    }
    .info-comment-length {
        color: grey;
        margin-top: 12px;
    }
    .warning-comment-length {
        color: red;
        margin-top: 12px;
    }
    @media (min-width: 900px) {
        .slider-skill-box {
            width: 60%;
        }
    }
`

export default GradeFormStyle;