/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled/macro';
import * as colors from './styles/Colors';
import {Image} from './Image.components'
import { Link } from "react-router-dom";

const buttonVariants = {
  addButton: {
    background: colors.gray,
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
    fontWeight: 'bold',
    transition: 'background-color 0.3s',  
    '&:hover, &:focus': {
      background: colors.orange,  
    },
    fill: colors.gray
  },

  deleteButton: {
    background: colors.gray,
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
    fontWeight: 'bold',
    transition: 'background-color 0.3s',  
    '&:hover, &:focus': {
      background: colors.orange,  
    },
    fill: colors.gray
  },

  iconButton: {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.3s', 
    '&:hover, &:focus': {  
      fill: colors.orange
    },
    fill: colors.green
  },

  circleTextButton: {
    background: `${colors.lightGreen}`,
    width: "35px",
    height: "35px",
    lineHeight: '35px',
    fontSize: '20px', 
    borderRadius: '20px',
    textAlign: 'center',
    border: `none`,
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s', 
    color: colors.white,
    '&:hover, &:focus': {  
      background: colors.orange,
    },
  },

  circleTextTransparentButton: {
    background: `none`,
    width: "20px",
    height: "20px",
    fontSize: '18px', 
    borderRadius: '50%',
    border: `2px solid ${colors.lightGreen}`,  
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
    color: colors.lightGreen,
  },

  circleTextButtonSmall: {
    background: `${colors.lightGreen}`,
    width: "25px",
    height: "25px",
    lineHeight: '22px',
    fontSize: '18px', 
    borderRadius: '20px',
    textAlign: 'center',
    border: `none`,
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s', 
    color: colors.white,
    '&:hover, &:focus': {  
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
    '&:hover, &:focus': {
      background: colors.orange,
    },
  },

  chartTextButton: {
    background: colors.olive,
    textAlign: 'center',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100px',
    height: '20px',
    lineHeight: '20px',
    marginTop: '5px',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: colors.white,
    transition: 'background-color 0.3s',
    fontSize: "13px",
    textDecoration: 'none',
    '&:hover, &:focus': {
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
    height: '50px',
    lineHeight: '50px',
    marginTop: '15px',
    marginBottom: '15px',
    color: colors.white,
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s', 
    textDecoration: 'none',
    '&:hover, &:focus': {
      background: colors.lightGreen,
    },
  },

  backButton: {
    background: colors.brown,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    
    height: '35px',
    lineHeight: '10px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: colors.green,
    paddingRight: "10px",
    paddingLeft: "10px",
    fontWeight: 'bold',
    transition: 'background-color 0.3s',  
    '&:hover, &:focus': {
      background: colors.orange,  
    },
    fill: colors.green
  },
  
};

const Button = styled.button(
    ({ variant = 'genericButton', width, height, background, disabled  }) => ({
      ...buttonVariants[variant],
      width: width || buttonVariants[variant].width,
      height: height || buttonVariants[variant].height,
      background: background || buttonVariants[variant].background,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      fontFamily: "'Balsamiq Sans', sans-serif",
    })
  );

const ImageContainer = styled.div(({ margin, padding }) => ({
    margin: margin || '0 10px 0 10px',  
    padding: padding || '0 0 0 0',
  }));

const ButtonText = ({ variant, name, navigateTo, width, height, children, onClick, disabled }) => {
  return (
      <Button 
      name={name} 
      variant={variant} 
      as={Link} 
      to={navigateTo} 
      width={width} 
      height={height} 
      onClick={(e) => {
        e.preventDefault() 
       if (onClick)  {
         onClick(e)
       }
      }} 
      disabled={disabled}>
          {children}
      </Button>
  );
};

const ButtonLink = ({ variant, as: LinkComponent = Link, to = '/', imageName, imageSize, width, height, margin, padding, children, onClick, disabled }) => {
  return (
    <Button 
    variant={variant} 
    as={LinkComponent} 
    to={to} 
    width={width} 
    height={height} 
    onClick={onClick} 
    disabled={disabled}>
    {imageName && <ImageContainer margin={margin} padding={padding}>
        <Image  imageName={imageName} width={imageSize} height={imageSize}/>
        </ImageContainer>}
    {children}
    </Button>
  );
};

const ButtonImage = ({ variant, name, imageName, imageSize, width, height, children, onClick, disabled, margin, padding,  }) => {
  return (
    <Button 
    name={name} 
    variant={variant} 
    width={width} 
    height={height} 
    onClick={(e) => {
      e.preventDefault() 
      onClick(e)
    }} 
    disabled={disabled}>
      {imageName && <ImageContainer margin={margin} padding={padding}>
        <Image  imageName={imageName} width={imageSize} height={imageSize}/>
        </ImageContainer>}
        {children}
    </Button>
  );
};

export { ButtonText, ButtonLink, ButtonImage };
