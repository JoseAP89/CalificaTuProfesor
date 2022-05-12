import styled from 'styled-components';

const RosterInfoStyle = styled.div`
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