import styled from '@emotion/styled/macro'
import {keyframes} from '@emotion/react'
import {FaSpinner} from 'react-icons/fa'
import {Dialog as ReachDialog} from '@reach/dialog'
import * as colors from './styles/Colors'
import * as mq from './styles/media-queries'
 
const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
})

const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
})

Spinner.defaultProps = {
  'aria-label': 'loading',
}

const Input = styled.input({
  borderRadius: '10px',
  border: `0px solid ${colors.gray}`,
  background: colors.white,
  padding: '8px 12px',
  minWidth: '250px',
  maxWidth: '300px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
})

const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.orange,
  color: colors.black,
  border: `1px solid ${colors.white}`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export {Input, CircleButton, Dialog, FormGroup, Spinner}
