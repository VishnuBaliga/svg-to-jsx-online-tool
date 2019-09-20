import React from 'react'; 
import copy from 'copy-to-clipboard';
import Header from './header';
import svgtojsx from 'svg-to-jsx'; 
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
 

const sampleSvg = '<svg version="1.1"><path id="myPath" style="font-family: Verdana; margin-bottom: 10px; -webkit-transition: all; ms-transition: all;"/></svg>';
 
export default class Convertor extends React.Component{
    constructor(){
        super();
        this.state = {
            convertedData:'',
            rawData:'',
            loading: false,
            copying:false,
            error:false,
            output: false
        }
        this.inputRef = React.createRef();
    }

    insertSample = (e) =>{ 
          this.setState({
                rawData: sampleSvg,
                    convertedData:'', 
                    loading: false,
                    copying:false,
                    error:false,
                    output: false
            });
    }
 
      handleCopy = (value) => {
            copy(value); 
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
                        this.setState({ 
                                convertedData: `${error}`, 
                        error:true,
                        loading: false,
                        output: true
                        });   
                }
            }); 
                

        }
        else{ 
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

    <Header />

          
 
                <div className="input-container">
                    <a className="sample-input" onClick={e=>this.insertSample(e)}>{`Click here to insert Sample SVG`}</a>
                    <h2>Input <small><strong>SVG</strong></small></h2>
                    <textarea placeholder={'Paster your SVG here..'} value={rawData} ref={this.inputRef} onChange={(e)=>this.handleChange(e) } rows={'10'}  /><br/>
                    <button type={'submit'} disabled={!rawData|loading} onClick={this.handleChange}>{loading?'Converting...':'Convert SVG to JSX'}</button> 
                </div> 

                {output && rawData &&
                        <div className={(error) ? 'error output-container':'output-container'}>
                            <h2>Output <small><strong>JSX</strong></small></h2>
                            {!error && rawData && convertedData && <button onClick={e=>this.handleCopy(`${convertedData}`)}>{copying?'Copied!':'Copy Code'}</button> } 
                            
                            <SyntaxHighlighter style={tomorrowNightBright}>
                                {convertedData}
                            </SyntaxHighlighter>  
                            {!error && rawData && convertedData && <>
                                <h2>Preview</h2>  
                                <div dangerouslySetInnerHTML={{__html:convertedData}} /> 
                            </>
                            }
                        </div>
                }

           
  

            </>
        )
    }
}
