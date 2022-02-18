import styled from 'styled-components';
interface Props {
    width: Number
}

const ListOptionsStyled = styled.div<Props>`

@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
width: ${ props => (String( Number(props.width) )  + "px") || "300px"} !important;
height: fit-content;
margin: 3px 0;
background-color: white;
z-index: 10;
.list-row {
    padding: 3px;
    box-shadow: 1px 1px 5px grey;
    color: black;
    display: grid;
    grid-template-columns: 1fr;
    p {
        font-size: .98em;
        letter-spacing: 6px;
    }

    cursor: pointer;
    .row-icon {
        justify-self: center;
        align-self: center;
    }

    .sub-top-row {
        display: grid;
        grid-template-columns: 2fr 11fr;
    }
    .sub-bottom-row {
        padding-left: 20px;
        display: grid;
        grid-template-columns: 2fr 11fr;
        p {
            color: grey;
            font-weight: bold;
        }
    }
}

.list-row:hover {
    background-color: #87cefa;
    .sub-top-row p {
        color: white;
        font-weight: bolder;
        font-size: 1.1em;
    }
}

`

export default ListOptionsStyled;