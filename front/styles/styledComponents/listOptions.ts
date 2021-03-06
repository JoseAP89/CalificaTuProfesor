import styled from 'styled-components';

const ListOptionsStyled = styled.div`

@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
height: fit-content;
margin: 3px 0;
background-color: white;
z-index: 100;
max-height: 50vh;
overflow-y: scroll;
position: absolute;
top:50px;
.list-row {
    padding: 3px;
    box-shadow: 1px 1px 5px grey;
    color: black;
    display: grid;
    grid-template-columns: 1fr;
    p {
        font-size: .98em;
        letter-spacing: 3px;
    }

    cursor: pointer;
    .row-icon {
        justify-self: center;
        align-self: center;
    }

    .sub-top-row {
        display: grid;
        grid-template-columns: 1fr 12fr;
    }
    .sub-bottom-row {
        font-size: 0.83rem;
        padding-left: 20px;
        display: grid;
        grid-template-columns: 1fr 12fr;
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

& {
    width: 70%;
}
@media (max-width: 1200px) {
    & {
        width: 85%;
    }
}
@media (max-width: 700px) {
    & {
        width: 90%;
    }
}

@media (max-width: 480px) {
    & {
        width: 95%;
    }
}

`

export default ListOptionsStyled;