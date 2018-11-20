import styled from "styled-components";

export const Container = styled.div`
  background-color: #d0d0d0;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #0000005c;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  width: 15vw;
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 20px;
  position: relative;
  box-sizing: border-box;
`;

export const Title = styled.h3`
  padding: 8px;
`;

export const CardList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props =>
    props.isDraggingOver ? "lightgrey" : "inherit"};
  flex-grow: 1;
  min-height: 100px;
  max-height: 300px;
  position: relative
  overflow-y: auto;
  
  
  
`;


export const ContainerB = styled.div`
  display: flex;
`;


export const ContainerC = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
  overflow: hidden;
`;
