'use strict';

class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes, model) {
    this._inputNodes = inputNodes;
    this._hiddenNodes = hiddenNodes;
    this._outputNodes = outputNodes;
    if (model)  {
      this._model = model;
    } else {
      this._model = this.createModel();
    }
  }
  
  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const modelWeights = this._model.getWeights();
      const copiesOfWeights = [];
      for(let i = 0; i < modelWeights.length; i++) {
        copiesOfWeights[i] = modelWeights[i].clone();
      }
      modelCopy.setWeights(copiesOfWeights);
      return new NeuralNetwork(
        this._inputNodes,
        this._hiddenNodes,
        this._outputNodes,
        modelCopy
      );
    });
  }
  
  mutate(rate) {
    tf.tidy(() => {
      const weights = this._model.getWeights();
      const mutatedWeights = [];
      for (let weight of weights) {
        let tensor = weight;
        let shape = weight.shape;
        let tensorData = tensor.dataSync().slice();
        for (let value of tensorData) {
          if (RandomSource(1) < rate) {
            value = value + randomGaussian();
          }
        }
        let newTensor = tf.tensor(tensorData, shape);
        mutatedWeights.push(newTensor);
      }
      this._model.setWeights(mutatedWeights);
    });
  }

  breed(mate) {
    return tf.tidy(() => {
      const newModel = this.createModel();
      const weights = this._model.getWeights();
      const mateWeights = mate._model.getWeights();
      const newWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let myTensor = weights[i];
        let mateTensor = mateWeights[i];
        let shape = weights[i].shape;
        let myTensorData = myTensor.dataSync();
        let otherTensorData = mateTensor.dataSync();
        let newValues = [];
        for (let j = 0; j < myTensorData.length; j++) {
          newValues.push((myTensorData[j] + otherTensorData[j]) / 2);
        }
        let newTensor = tf.tensor(newValues, shape);
        newWeights.push(newTensor);
      }
      newModel.setWeights(newWeights);
      return newModel;
    });
  }

  predict(inputs) {
    return tf.tidy(() => {
      //console.log(inputs);
      const inputData = tf.tensor2d([inputs]);
      const outputData = this._model.predict(inputData);
      return outputData.dataSync();
    });
  }

  dispose() {
    this._model.dispose();
  }
  
  createModel() {
    const model = tf.sequential();
    const hiddenLayer = tf.layers.dense({
      units: this._hiddenNodes,
      inputShape: [this._inputNodes],
      activation: 'sigmoid'
    });
    model.add(hiddenLayer);
    const outputLayer = tf.layers.dense({
      units: this._outputNodes,
      activation: 'softmax'
    });
    model.add(outputLayer);
    return model;
  }
}