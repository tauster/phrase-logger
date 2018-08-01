import * as React from 'react';
import './App.css';

export interface IPhraseRowProps { id?: string , phrase: string};

class PhraseRow extends React.Component<{}, IPhraseRowProps> {

  public static defaultProps: Partial<IPhraseRowProps> = {
    id: "1",
    phrase: "Defualt"
  };

  public render(this: any) {

    return (
      <tr key={this.props.phrase.id}>
        <td>{this.props.phrase.id}</td>
        <td>{this.props.phrase.phrase}</td>
        <td><button value={this.props.phrase.id} onClick={this.deletePhrase}>Delete</button></td>
      </tr>
    );
  }
}

export default PhraseRow;
