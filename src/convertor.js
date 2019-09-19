import React from 'react';
import replaceOnce from 'replace-once';
import { find, replace } from './findAndReplace';
import copy from 'copy-to-clipboard';

 
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import svgtojsx from 'svg-to-jsx'; 
 

var sampleSvg = '<svg version="1.1"><path id="myPath" style="font-family: Verdana; margin-bottom: 10px; -webkit-transition: all; ms-transition: all;"/></svg>';
 

export default class Convertor extends React.Component{
    constructor(){
        super();
        this.state = {
            convertedData:'',
            rawData:sampleSvg,
            loading: false,
            copying:false,
            error:false,
            output: false
        }
        this.inputRef = React.createRef();
    }
 
      handleCopy = (value) => {
            copy(value);
        console.log("copieeedd",  value);
        this.setState({
                copying:true,
            })
        setTimeout(()=>{
            this.setState({
                copying:false,
            })
        },500);
    }
    handleChange = (e) =>{  
    
        const rawData = this.inputRef.current.value;

            this.setState({
                rawData
            });    
        if(rawData){

            this.setState({
                loading: true,
                error:false,
            });    

            svgtojsx(rawData, (error, jsx) => {
                if(jsx) {
                    setTimeout(()=>{
                        this.setState({ 
                            convertedData: jsx, 
                            loading: false,
                            output: true
                        });   
                    },500);
                }
                else{ 
                    setTimeout(()=>{
                        this.setState({ 
                                convertedData: `${error}`, 
                        error:true,
                        loading: false,
                        output: true
                        });   
                    },500); 
                }
            }); 
                

        }
        else{
            console.log("empty..");
               this.setState({
                    convertedData:'',
                    rawData:'',
                    loading: false,
                    copying:false,
                    error:false,
                    output: false
                    }); 
        }

    }
    render()
    {
        const {convertedData,loading, rawData,copying,error, output} = this.state;
        return(
            <>
            <header>
                <h3>SVG to JSX Converter</h3> 
            </header>
 
                <div className="input-container">
                    <h2>Input</h2>
                    <textarea placeholder={'Paster your SVG here..'} value={rawData} ref={this.inputRef} onChange={(e)=>this.handleChange(e) } rows={'10'}  /><br/>
                    <button type={'submit'} disabled={!rawData|loading} onClick={this.handleChange}>{loading?'Converting...':'Convert SVG to JSX'}</button> 
                </div> 

    {output && rawData &&
            <div className={(error) ? 'error output-container':'output-container'}>
                <h2>Output</h2>
                {!error && rawData && convertedData && <button onClick={e=>this.handleCopy(`${convertedData}`)}>{copying?'Copied!':'Copy Code'}</button> } 
                
                 <SyntaxHighlighter language="javascript" style={dracula}>
                    {convertedData}
                </SyntaxHighlighter> 
            </div>
    }

           


            </>
        )
    }
}
