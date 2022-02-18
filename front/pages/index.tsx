import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Container, Box, SimpleGrid, Flex,
  Heading, Button, InputGroup, Input, InputRightAddon, InputLeftAddon, IconButton, Select
} from '@chakra-ui/react'
import starPic from '../public/star_pic.jpg';
import classroom from '../public/classroom.jpg';
import anonymous from '../public/anonymous.jpg';
import datapic from '../public/data.jpg';
import HomeContainer from '../styles/styledComponents/home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBuilding, faPerson, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import React, { ReactElement, useEffect, useState } from 'react'
import TeacherSearch from '../_models/teacherSearch';
import ListOptions from '../components/list-options'
import { Vessel } from '../_models/vessel'

const Home: NextPage = () => {
  
  const [teacherSearchBy, setTeacherSearchBy] = useState<TeacherSearch>(TeacherSearch.NAME);
  const [searchIcon, setSearchIcon] = useState<ReactElement>(<FontAwesomeIcon icon={faPerson}/>);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [searchedData, setSearchedData] = useState<Array<Array<Vessel>>>([]);
  
  useEffect(() => {
    let data = [
      [new Vessel(1, "Juan Fernandez"), new Vessel(1, "UNAM FES ARAGÓN")],
      [new Vessel(2, "Diana Cartagena"), new Vessel(1, "UAM AZCAPOTZALCO")]
    ];
    let type = TeacherSearch.NAME;
    setSearchedData(data);
    setTeacherSearchBy(type);

  }, []);


  function process_search(e: any) {
    e.preventDefault() ;
    if (searchTarget !== "") {
      console.log(`\{"teacherSearchby": "${teacherSearchBy}", "searchTarget": "${searchTarget}"\}`) ;
    }
  }


  return (
    <>

      <HomeContainer inputColor='white' className='home-container-search-bar'>
        <SimpleGrid columns={{ sm: 1 }} spacing='40px'>
          <Flex h='60px' justify='center'>
            <Heading color={'white'}>
              Comienza buscando tu profesor
            </Heading>
          </Flex>
          <Flex  justify='center' direction={'column'} className='search-bar-container'>
            <label htmlFor="search-by" className='select-search-lbl'>Busca por:</label>
            <select
              id='search-by'
              defaultValue={"teacher"}
              color='white'
              className='select-search'
              onChange={(e) => {
                if(e.target.value == "teacher"){
                  setTeacherSearchBy(TeacherSearch.NAME);
                  setSearchIcon(<FontAwesomeIcon icon={faPerson} />)
                } else { // it was selected by campus
                  setTeacherSearchBy(TeacherSearch.CAMPUS);
                  setSearchIcon(<FontAwesomeIcon icon={faBuilding} />)
                }
              }}
            >
              <option value="teacher" >Profesor</option>
              <option value="campus">Campus</option>
            </select>

            <div className='search-bar-list-container'>
              <InputGroup size='lg' width={{ base: '100%', md: '90%' ,  lg:'80%' , xl:'70%'}} className='search-bar' id='full-search-bar'>
                <InputLeftAddon 
                  children={searchIcon} 
                  className='left-icon'
                />
                <Input placeholder='mysite' 
                  onChange={ (e) =>{
                    setSearchTarget(e.target.value);
                  }}
                  onFocus={ (e) =>{
                    setSearchTarget(e.target.value);
                  }}
                />
                <InputRightAddon 
                  className='search-bar'
                  children={
                    <IconButton
                    style={{width:"100%"}}
                    colorScheme='blue'
                    aria-label='Search database'
                    size='sm'
                    className='search-icon'
                    onClick={(e) => { process_search(e) }}
                    icon={<FontAwesomeIcon icon={faSearch} />}
                    />
                  } 
                />
              </InputGroup>
              {
                searchedData.length>0 && 
                <ListOptions type={teacherSearchBy} data={searchedData} />
                
              }
            </div>


          </Flex>
        </SimpleGrid>
        <FontAwesomeIcon  icon={faAngleDoubleDown} className='arrow-down'
          onClick={() => {window.location.href="/#grade"}}
        />
      </HomeContainer>


      <HomeContainer  id='grade'>
        <section className='grade'>
          <Heading py='3' size='2xl'>Calificalos</Heading>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='40px'>
            <Box h='fit-content'>
              <p>
                Este es un espacio donde puedes calificar a tu maestro otorgándole
                estrellas por su desempeño, conocimiento y aptitudes en el salón de clases.
              </p>
            </Box>
            <Flex h='200px' justify='center'>
              <Image
                src={starPic}
                alt='Grado en estrella'
                width={300}
                height={300}
                className={styles.pics}
              />
            </Flex>
          </SimpleGrid>
        </section>
      </HomeContainer>

      <HomeContainer inputColor='#D6BCFA'> 
        <section className='search' >
          <Heading py='3' size='2xl'>Búscalos</Heading>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='40px'>
            <Flex h='200px' justify='center'>
              <Image
                src={classroom}
                alt='Salón de clases'
                width={300}
                height={300}
                className={styles.pics}
              />
            </Flex>
            <Box h='fit-content'>
              <p>
                Busca a tu profesor para conocer sus estadísticas de rendimiento y
                decidir mejor si te acomoda más para tu curso y puedas aprovechar lo
                más posible de tu educación. Los requisitos para cada estudiante varían,
                quieres uno exigente, uno barco, uno que enseñe excelente, o que deje muchas
                o pocas tareas, tú decides cuál se acomoda a tu tiempo y necesidades.
              </p>
            </Box>
          </SimpleGrid>
        </section>
      </HomeContainer>

      <HomeContainer inputColor='#9AE6B4'>
        <section className='anonymous' >
          <Heading py='3' size='2xl'>Anonimato</Heading>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='40px'>
            <Box h='fit-content'>
              <p>
                Todos en este sitio sucede de forma anónima, no pedimos información de
                usuarios, cuentas, nombres ni apellidos para poder utilizar el portal.
                Está basado en la confianza para su uso práctico, pero esto no significa
                que se toleraran comentarios que agredan a los usuarios y/o maestros, así
                que por favor disfruta el sitio y ten comentarios constructivos,
                no ofensivos. Aquellos comentarios que violenten a otros serán eliminados.
              </p>
            </Box>
            <Flex h='250px' justify='center'>
              <Image
                src={anonymous}
                alt='Salón de clases'
                width={300}
                height={250}
                className={styles.pics}
              />
            </Flex>
          </SimpleGrid>
        </section>
      </HomeContainer>

      <HomeContainer>
        <section  className='data' >
          <Heading py='3' size='2xl'>Datos</Heading>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='40px'>
            <Flex h='200px' justify='center'>
              <Image
                src={datapic}
                alt='Salón de clases'
                width={300}
                height={300}
                className={styles.pics}
              />
            </Flex>
            <Box h='fit-content'>
              <p>
                Al calificar al maestro también se califica a la universidad perteneciente,
                por lo que también hay estadísticas por campus y universidad. Podrás consultar
                datos concretos sobre tu maestro, campus universitario o la totalidad
                de tu universidad.
              </p>
            </Box>
          </SimpleGrid>
        </section>
      </HomeContainer>
    </>
  )
}

export default Home
