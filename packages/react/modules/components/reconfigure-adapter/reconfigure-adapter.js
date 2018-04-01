// @flow

import type { User, AdapterArgs } from '@flopflip/types';

import React, { PureComponent, type Node } from 'react';

import { withReconfiguration } from '../configure-adapter';

type Props = {
  exact?: boolean,
  user: User,
  reconfigure: (adapterArgs: AdapterArgs, { exact?: boolean }) => void,
  children: React.Component<any>,
};

export class ReconfigureAdapter extends PureComponent<Props> {
  static displayName = 'ReconfigureAdapter';

  static defaultProps = {
    exact: false,
    children: null,
  };

  componentDidMount(): void {
    return this.props.reconfigure(
      {
        user: this.props.user,
      },
      {
        exact: this.props.exact,
      }
    );
  }

  componentDidUpdate(): void {
    return this.props.reconfigure(
      {
        user: this.props.user,
      },
      {
        exact: this.props.exact,
      }
    );
  }

  render(): Node {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}

export default withReconfiguration()(ReconfigureAdapter);