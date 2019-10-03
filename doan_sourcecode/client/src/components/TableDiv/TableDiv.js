import React from 'react'
import classes from './TableDiv.css'

function TableDiv(props) {
    let tableDiv, table, eachData, i, array;

    const groupTr = (_, id) => (table += `<td>${eachData[i][id]}</td>`);
    const groupTh = (_, id) => (table += `<th>${eachData[0][id]}</th>`);

    tableDiv = props.data.map(d => {
        table = `<table class="table table-striped table-dark"><thead><tr>`;

        eachData = Object.entries(d[Object.keys(d)]).map(
          ([key, value]) => ({ key, ...value })
        );

        array = [...Array(Object.keys(eachData[0]).length - 1).keys()];

        table += `<th>${eachData[0].key}</th>`;
        array.forEach(groupTh)
        table += `</tr></thead><tbody>`
        
        for (i = 1; i < eachData.length; i++) {
            table += '<tr>';
            table += `<td>${eachData[i].key}</td>`;
            array.forEach(groupTr)
            table += '</tr>';
        }
        table += '</tbody></table>';

        return (
          <div className={classes.tableDiv} key={Object.keys(d)[0]}>
            <h4>{Object.keys(d)[0]}</h4>
            <div dangerouslySetInnerHTML={{ __html: table }}></div>
          </div>
        );
    })

    return (
        <div>
            {tableDiv}
        </div>
    )
}

export default TableDiv
