/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled/macro';
import * as colors from './styles/colors';
import {Image} from './Image.components'
import { Link } from "react-router-dom";

const buttonVariants = {
  addButton: {
    background: colors.lightGreen,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '130px',
    height: '35px',
    marginBottom: '10px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: colors.white,
    paddingRight: "10px",
    paddingLeft: "10px",
    transition: 'background-color 0.3s',  
    '&:hover': {
      background: colors.orange,  
    },
    fill: colors.green
  },

  iconButton: {
    cursor: 'pointer',
    background: 'none',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.3s', 
    '&:hover': {  
      fill: colors.orange
    },
    fill: colors.green
  },
};

const Button = styled.button(
    ({ variant = 'genericButton', width, height }) => ({
      ...buttonVariants[variant],
      width: width || buttonVariants[variant].width,
      height: height || buttonVariants[variant].height,
    })
  );

const ImageContainer = styled.div(({ margin, padding }) => ({
    margin: margin || '0 10px 0 10px',  
    padding: padding || '0px',    
  }));

const ButtonWithImage = ({ variant, navigateTo, imageName, imageSize, width, height, margin, padding, children, onClick }) => {
return (
    <Button variant={variant} as={Link} to={navigateTo} width={width} height={height} onClick={onClick}>
    {imageName && <ImageContainer margin={margin} padding={padding}>
        <Image  imageName={imageName} width={imageSize} height={imageSize}/>
        </ImageContainer>}
    {children}
    </Button>
);
};

export { ButtonWithImage, Button };
