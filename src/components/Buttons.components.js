/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled/macro';
import * as colors from './styles/Colors';
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
    lineHeight: '20px',
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

  circleTextButton: {
    background: `${colors.lightGreen}`,
    width: "35px",
    height: "35px",
    lineHeight: '30px',
    fontSize: '20px', 
    borderRadius: '20px',
    textAlign: 'center',
    border: `none`,
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s', 
    color: colors.white,
    '&:hover': {  
      background: colors.orange,
    },
     
  },

  rectangleTextButton: {
    background: colors.lightGreen,
    textAlign: 'center',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '150px',
    height: '40px',
    lineHeight: '40px',
    marginTop: '15px',
    marginBottom: '15px',
    fontWeight: 'bold',
    color: colors.white,
    transition: 'background-color 0.3s', 
    textDecoration: 'none',
    '&:hover': {
      background: colors.orange,
    },
  },

  login: {
    background: colors.olive,
    textAlign: 'center',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '150px',
    height: '40px',
    lineHeight: '40px',
    marginTop: '15px',
    marginBottom: '15px',
    color: colors.white,
    transition: 'background-color 0.3s', 
    textDecoration: 'none',
    '&:hover': {
      background: colors.lightGreen,
    },
  },

  backButton: {
    background: colors.brown,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '130px',
    height: '35px',
    lineHeight: '`10`px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: colors.green,
    paddingRight: "10px",
    paddingLeft: "10px",
    transition: 'background-color 0.3s',  
    '&:hover': {
      background: colors.orange,  
    },
    fill: colors.green
  },
  
};

const Button = styled.button(
    ({ variant = 'genericButton', width, height, disabled  }) => ({
      ...buttonVariants[variant],
      width: width || buttonVariants[variant].width,
      height: height || buttonVariants[variant].height,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
    })
  );

const ImageContainer = styled.div(({ margin, padding }) => ({
    margin: margin || 'auto 10px auto 10px',  
    padding: padding || '0px',
  }));

const ButtonText = ({ variant, navigateTo, width, height, children, onClick, disabled }) => {
  return (
      <Button variant={variant} as={Link} to={navigateTo} width={width} height={height} onClick={onClick} disabled={disabled}>
          {children}
      </Button>
  );
};


const ButtonWithImage = ({ variant, navigateTo, imageName, imageSize, width, height, margin, padding, children, onClick, disabled }) => {
return (
    <Button variant={variant} as={Link} to={navigateTo} width={width} height={height} onClick={onClick} disabled={disabled}>
    {imageName && <ImageContainer margin={margin} padding={padding}>
        <Image  imageName={imageName} width={imageSize} height={imageSize}/>
        </ImageContainer>}
    {children}
    </Button>
  );
};

export { ButtonText, ButtonWithImage };
