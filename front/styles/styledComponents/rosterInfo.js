import styled from 'styled-components';

const RosterInfoStyle = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
    overflow: scroll;
    padding: 5px 100px ;
    * {
        font-family: 'Courier Prime', monospace;
    }
    .add-comment-btn {
        margin: 40px 0;
    }
    .table-title {
        padding: 40px 0px;
        font-size: 1.3rem;
        color: black;
        font-weight: 700;
    }

    .roster-info-box {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        .title-box {
            color: black;
            font-weight: bold;
            font-size: 1.6rem;
            text-shadow: 1px 1px grey;
            text-transform: uppercase;
            margin-bottom: 40px;
        }
        .label-brief{
            margin-top: 20px;
            font-weight: 700;
            text-transform: capitalize;
        }
        .content-brief {
            margin-left: 50px;
            color: gray;
            font-weight: 700;
        }
        .box-info {
            margin-top: 20px;
            padding: 14px;
            font-size: 1.3rem;
            border: solid gray;
            background-color: #faf0e6;
            border-radius: 10px;
            .skills-box{
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
        }
    }
    @media (max-width: 944px){
        i[data-star] {
            --star-height: 100px;
            /** star line-heght and font-size must be equal to avoid different dimensions between grey and yellow stars*/
            font-size: var(--star-height);
            line-height: var(--star-height);
        }        
    }
    @media (max-width: 1840px){
        .roster-info-box {
            grid-template-columns: 1fr;
        }        
    }
    @media (max-width: 995px){
        .box-info {
            .skills-box{
                display: grid;
                grid-template-columns: 1fr 1fr !important;
                gap: 0;
            }
        }
    }

    .comments-container {
        margin-top: 40px;
        --rad: 14px;
        --num-cols: 7;
        .comment-block {
            margin: 3px 0;
            font-size: 1.2rem;
            background-color: #fdd5b1;
            padding:  0 0 10px 0;
            border: 2px solid;
            border-radius: var(--rad);
            display: grid;
            grid-template-columns: repeat( var(--num-cols), 1fr);
            .info-block {
                padding: 10px;
                grid-row: 1;
                grid-column: 1 / calc( var(--num-cols) + 1 );
                border-radius: var(--rad);
                background-color: #ebddcc;
                .info-content {
                    display: flex;
                    justify-content: space-around;
                    .info-item {
                        .info-title {
                            font-weight: bolder;
                        }
                    }
                }
            }
            .teacher-logo-block {
                grid-row: 2;
                grid-column: 1 / 2;
                .user-logo {
                    padding: 30px;
                    font-size: 9.3rem;
                }
            }
            .text-block {
                padding: 8px 8px 8px 0;
                grid-row: 2;
                grid-column: 2 / calc( var(--num-cols) + 1 );
            }
            .buttons-block {
                margin-top: 20px;
                grid-row: 3;
                grid-column: var(--num-cols) / calc( var(--num-cols) + 1 );
                display: flex;
                align-items: center;
                justify-content: space-around; 
                font-size: 1.9rem;
                .btn {
                    cursor: pointer;
                }
                .like-it {
                    color: blue;
                }
            }
        }
    }


`
//

export default RosterInfoStyle;