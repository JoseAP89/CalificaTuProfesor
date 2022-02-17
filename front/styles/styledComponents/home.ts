import styled from 'styled-components';

interface Props {
    inputColor?: string
}
const HomeContainer = styled.div<Props>`
    padding: 60px 100px ;
    background-color: ${props => props.inputColor ||  "#90cdf4"};
    .search-bar-container {
        width: calc(100vw - 300px);
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
    }

    @media (max-width: 700px) {
        padding: 60px 20px ;
        .search-bar-container {
            width: 95vw;
        }
        
    }

    @media (max-width: 480px) {
        padding: 60px 14px ;
        .search-bar-container {
            width: 95vw;
            margin-top: 20px;

            .left-icon {
                display: none;
            }
        }
        
    }

`

export default HomeContainer;