import styled from 'styled-components';

const CampusInfoStyle = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
    padding: 60px 100px ;
    .building-img {
        display: block;
        margin: 0 auto;
        height: 450px;
        width: 700px;
        border-radius: 14px;
    }
    .table-title {
        padding: 40px 0px;
        font-size: 1.3rem;
        color: black;
        font-weight: 700;
    }
    .campus-brief-info {
        margin-top: 70px;
        font-size: 1.3rem;
        .label-brief{
            margin-top: 20px;
            font-weight: 700;
        }
        .content-brief {
            margin-left: 50px;
            color: gray;
            font-weight: 700;
        }
    }

`
//

export default CampusInfoStyle;