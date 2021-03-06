import styled from 'styled-components';

interface Props {
    inputColor?: string
}
const HomeContainer = styled.div<Props>`
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
    padding: 60px 200px ;
    background-color: ${props => props.inputColor ||  "#90cdf4"};

    &.home-container-search-bar {
        h1, label {
            color: whitesmoke;
        }
        background-image: url('/chalkboard.jpg');
        background-size: cover;
        height: 100vh;
        .arrow-down {
            color:white;
            z-index: 10;
            font-size:130px;
            cursor: pointer;
            position: absolute;
            top:78vh;
            left: 48vw;
        }
    }

    .search-bar-container {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        margin: 0 20px 0 20px;
        justify-items: center;
        .search-bar-list-container{
            display: grid;
            justify-items: center;
            width: 70%;
        }
        .search-bar {
            background-color: white;
            padding: 0;
            .search-icon.search-icon.search-icon.search-icon {
                padding: 0;
                margin: 0;
                height:  inherit;
                width: 100px !important;
                border-radius: 5%;
                font-size: large;
            }
        }

        .select-search{
            width: 200px;
            height: 50px;
            border-radius: 5%;
            padding: 6px;
            background-color: #dcdcdc;
            border: 1px solid gray;
            cursor: pointer;
            margin-bottom: 40px;
            font-size: 18px;
        }
        .select-search:hover{
            border: 2px solid #1e90ff;
        }
        label.select-search-lbl {
            font-family: 'Indie Flower', cursive;
            font-size: 24px;
        }
    }

    .alert-add-request {
        margin-top: 50px;
        border-radius: 25px;
        display: grid;
        grid-template-columns: 1fr 1fr;

        .info-icon {
            display: inline-block;
        }
        .left-side {
            a {
                color: #00bfff;
                font-weight: bolder;
            }
        }
        .right-side {
            justify-self: flex-end;
            .close-icon {
                cursor: pointer;
            }
        }
    }

    @media (max-width: 1200px) {
        padding: 60px 90px ;
        .search-bar-list-container {
            width: 85%;
        }
    }
    @media (max-width: 700px) {
        padding: 60px 20px ;
        .search-bar-list-container {
            width: 90%;
        }
        
    }
    @media (max-width: 480px) {
        padding: 60px 14px ;
        .search-bar-list-container {
            width: 95%;
            margin-top: 20px;

            .left-icon {
                display: none;
            }
        }
        
    }

`

export default HomeContainer;