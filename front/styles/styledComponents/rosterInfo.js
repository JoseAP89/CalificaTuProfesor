import styled from 'styled-components';

const RosterInfoStyle = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
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
    .campus-brief-info {
        margin-top: 4px;
        font-size: 1.3rem;
        --star-size: 4.9rem;
        .grade-system {
            width: 300px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            #star1 {
                grid-column: 1 / 2;
                fill: yellow;
                color: #ebddcc;
            }
            #star2 {
                grid-column: 2 / 3;
            }
            #star3 {
                grid-column: 3 / 4;
            }
            #star4 {
                grid-column: 4 / 5;
            }
            #star5 {
                grid-column: 5 / 6;
                grid-row: 1;
            }
            #star5_grey {
                grid-column: 5 / 6;
                grid-row: 1;
                width: 80%;
                background-color: yellow;
                color: yellow;
                overflow: hidden;
                white-space: nowrap;
            }
        }
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