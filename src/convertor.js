import React from 'react';
import replaceOnce from 'replace-once';
import { find, replace } from './findAndReplace';
import copy from 'copy-to-clipboard';


import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
        }
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
    
        const {rawData} = this.state;

        if(rawData){
            this.setState({
                loading: true,
                error:false,
            });   
            // const FinalData =  async () => { return replaceOnce(rawData, find, replace, 'gi')};
            // const convertedData = await FinalData();

            svgtojsx(rawData, (error, jsx) => {
                if(jsx) {
                    setTimeout(()=>{
                        this.setState({ 
                            convertedData: jsx, 
                            loading: false,
                        });   
                    },500);
                }
                else{
                    // console.log("Error-->>",error,"------->>>",typeof(error));
                    setTimeout(()=>{
                        this.setState({ 
                                convertedData: `${error}`, 
                        error:true,
                        loading: false,
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
                    }); 
        }

    }
    render()
    {
        const {convertedData,loading, rawData,copying,error} = this.state;
        return(
            <>
            <h1>SVG to JSX Convertor</h1>
             
                <textarea placeholder={'Paster your SVG here..'} id="textarea" value={rawData} onChange={(e)=>this.setState({rawData: e.target.value}) } rows={'10'}  /><br/>
                <button type={'submit'} disabled={!rawData} onClick={this.handleChange}>{loading?'Converting...':'Convert SVG to JSX'}</button> 
            <br/>
            <br/>
            <br/>
            {/* {loading?<>loading....<div className="loader"></div></>:null}  */}

            <div className={(error) ? 'error output-container':'output-container'}>
                {!error && rawData && convertedData && <button onClick={e=>this.handleCopy(`${convertedData}`)}>{copying?'Copied!':'Copy Code'}</button> }
                {/* <textarea ref="output" rows={'10'} value={convertedData} disabled />  */}
                
                
                 <SyntaxHighlighter language="javascript" style={docco}>
                    {convertedData}
                </SyntaxHighlighter>
                

    
            </div>

           


            </>
        )
    }
}
