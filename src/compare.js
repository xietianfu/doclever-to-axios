function examineChange(benchmark = [], compare = []) {
  let _benchmark = new Set(benchmark.map(item => JSON.stringify(item)));
  let _compare = new Set(compare.map(item => JSON.stringify(item)));
  let _diffBenchmark = new Set(
    [..._benchmark].filter(item => !_compare.has(item))
  );
  let _diffCompare = new Set(
    [..._compare].filter(item => !_benchmark.has(item))
  );
  return {
    deffBenchmark: Array.from(_diffBenchmark).map(item => JSON.parse(item)),
    diffCompare: Array.from(_diffCompare).map(item => JSON.parse(item))
  };
}

function flattenApi(apiData) {
  let result = [];
  apiData.forEach(item => {
    if (item.data && item.data.length > 0) {
      const res = flattenApi(item.data);
      result.push(...res);
    }
    if (item.url) {
      result.push(item);
    }
  });
  return result;
}

function examineDelet(benchmark, compare) {
  return benchmark.filter(item => !compare.some(cell => cell.id === item.id));
}

function examineAdd(benchmark, compare) {
  return compare.filter(item => !benchmark.some(cell => cell.id === item.id));
}

function examineEdit(benchmark, compare, add, delet) {
  let _editBen = benchmark.filter(
    item => !delet.some(cell => cell.id === item.id)
  );
  let _editCom = compare.filter(item => !add.some(cell => cell.id === item.id));
  let _res = [];
  _editBen.forEach(item => {
    const find = _editCom.find(cell => item.id === cell.id);
    _res.push({
      benchmark: item,
      compare: find
    });
  });
  return _res;
}

function compare({ benchmarkApi, compareApi }) {
  let result = {
    add: {},
    change: {},
    delet: {}
  };
  let _benchmarkData = benchmarkApi.data;
  let _compareData = compareApi.data;
  // 删除回收站
  _benchmarkData = _benchmarkData.filter(item => item.name !== "#回收站");
  _compareData = _compareData.filter(item => item.name !== "#回收站");
  // 降维api
  _benchmarkData = flattenApi(_benchmarkData);
  _compareData = flattenApi(_compareData);

  const { deffBenchmark, diffCompare } = examineChange(
    _benchmarkData,
    _compareData
  );
  const add = examineAdd(deffBenchmark, diffCompare);
  const delet = examineDelet(deffBenchmark, diffCompare);

  return {
    add,
    delet,
    change: examineEdit(deffBenchmark, diffCompare, add, delet)
  };
}

module.exports = {
  compare
};
