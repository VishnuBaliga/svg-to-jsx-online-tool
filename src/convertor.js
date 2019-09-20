import React from 'react';
import replaceOnce from 'replace-once';
import { find, replace } from './findAndReplace';
import copy from 'copy-to-clipboard';

 
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import svgtojsx from 'svg-to-jsx'; 
 

var sampleSvg = '<svg version="1.1"><path id="myPath" style="font-family: Verdana; margin-bottom: 10px; -webkit-transition: all; ms-transition: all;"/></svg>';
 
function SVGPreview({svg}){ 
    return svg
}


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

 

            <header>
                <h3>SVG to JSX Converter</h3> 
                 <svg className="wave" height="50px" style={{"pointerEvents":"none"}} width="100%" preserveAspectRatio="none" viewBox="0 0 1920 75" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<clipPath id="a">
			<rect className="a" height="75" width="1920"/>
		</clipPath>
	</defs>
	<title>wave</title>
	<g className="b">
		<path className="c" d="M1963,327H-105V65A2647.49,2647.49,0,0,1,431,19c217.7,3.5,239.6,30.8,470,36,297.3,6.7,367.5-36.2,642-28a2511.41,2511.41,0,0,1,420,48"/>
	</g>
	<g className="b">
		<path className="d" d="M-127,404H1963V44c-140.1-28-343.3-46.7-566,22-75.5,23.3-118.5,45.9-162,64-48.6,20.2-404.7,128-784,0C355.2,97.7,341.6,78.3,235,50,86.6,10.6-41.8,6.9-127,10"/>
	</g>
	<g className="b">
		<path className="d" d="M1979,462-155,446V106C251.8,20.2,576.6,15.9,805,30c167.4,10.3,322.3,32.9,680,56,207,13.4,378,20.3,494,24"/>
	</g>
	<g className="b">
		<path className="d" d="M1998,484H-243V100c445.8,26.8,794.2-4.1,1035-39,141-20.4,231.1-40.1,378-45,349.6-11.6,636.7,73.8,828,150"/>
	</g>
</svg>
            </header>
 
                <div className="input-container">
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
