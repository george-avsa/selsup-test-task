import React, { Component } from 'react';

interface Param {
    id: number;
    name: string;
    type: 'string';
}

interface ParamValue {
    paramId: number;
    value: string;
}

interface Model {
    paramValues: ParamValue[];
}
  
type State = {
    params: Param[];
    model: Model;
};

type Props = {
    params: Param[];
    model: Model;
    setParamValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
    addNewParam: (e: React.FormEvent<HTMLFormElement>) => void;
};

const initState: State = {
    params: [
        {
            "id": 1,
            "name": "Назначение",
            type: 'string'
        },
        {
            "id": 2,
            "name": "Длина",
            type: 'string'
        }            
    ],
    model: {
        paramValues: [
            {
                "paramId": 1,
                "value": "повседневное"
              },
              {
                "paramId": 2,
                "value": "макси"
              }              
        ]
    }
}

export default class App extends Component<{}, State> {
    state: State = initState;

    setParamValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const name = e.target.name;

        this.setState((state) => ({
            params: [...state.params],
            model: {
                paramValues: state.model.paramValues.map(paramValue => {
                    if (paramValue.paramId === Number.parseInt(name)) {
                        return {paramId: paramValue.paramId, value};
                    }
                    return {...paramValue};
                }),
            }
        }));
    }

    addNewParam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formElement = e.currentTarget;
        const param = formElement.param.value;
        const paramValue = formElement.paramValue.value;
        const type = formElement.type.value;

        if (!param) {
            formElement.param.classList.add(AdditionForm.inputErrorClass);
        } else {
            const autoIncrementId = this.state.params.reduce((acc: number, param: Param) => {
                if (param.id > acc) {
                    return param.id
                }
                return acc;
            }, 0);

            this.setState((state: State) => ({
                params: [
                    ...state.params, {
                        id: autoIncrementId + 1,
                        name: param,
                        type,
                    }
                ],
                model: {
                    paramValues: [...state.model.paramValues, {
                        paramId: autoIncrementId + 1,
                        value: paramValue
                    }]
                },
            }));
        }
    }

    render() {
        return (
            <ParamEditor 
                params={this.state.params} 
                model={this.state.model} 
                setParamValue={this.setParamValue} 
                addNewParam={this.addNewParam}
            />
        )
    }
}

class ParamEditor extends React.Component<Props, State> {
    public getModel(): Model {
        return this.props.model;
    }

  render() {
    return (
      <div className='container mx-auto p-5'>
        {this.props.params.map(param => {
            const paramValue = this.props.model.paramValues.find(values => {
                if (param.id === values.paramId) {
                    return true;
                } 
                return false;
            });
            return (<div key={param.id} className='flex mt-1'>
                <span className='w-auto md:w-32'>{param.name}</span>
                <input 
                    type="text" 
                    className='ml-2 md:ml-0'
                    placeholder={paramValue?.value} 
                    value={paramValue?.value}
                    onChange={this.props.setParamValue}
                    name={`${param.id}`}
                ></input>
            </div>);
        })}
        <AdditionForm
            addNewParam={this.props.addNewParam}
        ></AdditionForm>
      </div>
    )
  }
}

type AdditionFormProps = {
    addNewParam: (e: React.FormEvent<HTMLFormElement>) => void;
}

type AdditionFormState = {
    param: string,
    paramValue: string,
}

class AdditionForm extends Component<AdditionFormProps, AdditionFormState> {
    static inputErrorClass = 'input--error';

    state: AdditionFormState = {
        param: '',
        paramValue: '',

    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;

        if (input.classList.contains(AdditionForm.inputErrorClass)) {
            input.classList.remove(AdditionForm.inputErrorClass);
        }

        const value = input.value;
        const name = input.name;

        this.setState(state => ({...state, [name]: value,}));
    }

  render() {
    return (
        <div className='mt-4'>
        <p className=''>Добавить параметр</p>
        <form 
            className='flex flex-col md:flex-row' 
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                this.props.addNewParam(e);
                this.setState((state) => ({param: '', paramValue: ''}))
            }}
        >
            <input 
                type='text' 
                className='bg-slate-100 py-1 px-1 rounded-lg mt-2 md:mt-0' 
                name='param'
                onChange={this.handleChange}
                value={this.state.param}
                ></input>
            <input 
                type='text' 
                className='ml-0 md:ml-2 bg-slate-100 py-1 px-1 rounded-lg mt-2 md:mt-0' 
                name='paramValue'
                onChange={this.handleChange}
                value={this.state.paramValue}
                ></input>
            <select className='ml-0 md:ml-2 bg-slate-100 px-2 py-2 mt-2 md:mt-0' name='type'>
                <option>string</option>
            </select>
            <button className='bg-slate-300 py-1 px-3 rounded-lg md:ml-2 mt-2 md:mt-0'>Добавить</button>
        </form>
        </div>
    )
  }
}


