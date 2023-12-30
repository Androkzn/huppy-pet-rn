/** @jsxImportSource @emotion/react */

import * as colors from './Colors';
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro';

const rowStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
};

const columnStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
};

const responsiveSubContainer = styled.div({
  ...rowStyle,
  justifyContent: 'center',
  [mq.small]: {
    width: '100%',
    flexDirection: 'column',
  },
});

const responsiveMainContainer = styled.div({
  ...rowStyle,
  [mq.small]: {
    width: '100%',
    flexDirection: 'column',
  },
});

const SelectDateContainer = styled.div({
  ...rowStyle,
  marginTop: '15px',
  width: '60%',
  [mq.small]: {
    width: '100%',
    flexDirection: 'column',
  },
});

const linkNameContainerStyle = {
  ...rowStyle,
  justifyContent: 'start',
};

const linkIconStyle = {
  ...columnStyle,
  width: '60px',
  alignItems: 'center',
};

const linkContainerStyle = {
  ...rowStyle,
  height: '50px',
  justifyContent: 'space-between',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  margin: '10px 10px 0px 10px',
  border: `1px solid ${colors.lightGreen}`,
  borderRadius: '10px',
  background: colors.grayBackground,
};

const linkTitleStyle = {
  color: colors.green,
  fontWeight: 'bold',
  margin: '0px 10px',
};

const linkArrowStyle = {
  alignItems: 'right',
  width: '5%',
  margin: '0px 10px',
};

export {
  linkNameContainerStyle,
  linkArrowStyle,
  linkIconStyle,
  linkContainerStyle,
  linkTitleStyle,
  SelectDateContainer,
  rowStyle,
  columnStyle,
  responsiveMainContainer,
  responsiveSubContainer,
};
