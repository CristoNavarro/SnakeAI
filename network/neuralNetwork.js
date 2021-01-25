'use strict';

/**
 * @desc Esta clase define una red neuronal de un individuo de la población.
 *    Estamos usando TensorFlow para definir fácilmente el modelo o topología de la red neuronal (no para entrenarla)
 */
class NeuralNetwork {
  /**
   * @desc Constructor de una red neurnal, si model es null creará un nuevo modelo, 
   *    si model tiene un valor copiará el modelo que se pasa 
   *    (Es decir, en vez de partir de pesos aleatorios partiremos de los del modelo pasado como referencia, no se crea una copia así que cuidado con las referencias)
   * @param {Number} inputNodes - Cantidad de nodos de entrada de la red neuronal
   * @param {Array} hiddenNodes - Array indicando, para cada capa oculta, la cantidad de nodos que tiene
   * @param {Number} outputNodes - Cantidad de nodos de salida de la red neuronal
   * @param {Object} model - Parámetro que puede ser null. Si se pasa un modelo en vez de null se creará el modelo de esta red neuronal a partir del mismo (con los pesos que tiene)
   */
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
  
  /**
   * @desc Este método nos devuelve una copia de la red actual. Para ello copiamos el modelo 
   *    y clonamos los pesos manualmente para que no se cree una referencia a los mismos. Por último
   *    se devuelve una nueva instancia de la red neuronal.
   * @return {NeuronalNetwork} - Red neuronal nueva, copia de sí misma
   */
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
  
  /**
   * @desc Muta los pesos de la red neuronal con una cierta probabilidad. Para
   *    ello se utiliza una distribucion Gaussiana, de la que se obtiene un
   *    valor que se añade al peso actual.
   * @param  {Number} rate - Probabilidad de mutar cada uno de los pesos
   */
  mutate(rate = 0.2) {
    tf.tidy(() => {
      const weights = this._model.getWeights();
      const mutatedWeights = [];
      for (let weight of weights) {
        let tensor = weight;
        let shape = weight.shape;
        let tensorData = tensor.dataSync().slice();
        for (let i = 0; i < tensorData.length; i++) {
          if (Math.random() < rate) {
            tensorData[i] = tensorData[i] + randomGaussian() / 5;
            if (tensorData[i] > 1) {
              tensorData[i] = 1;
            }
            if (tensorData[i] < -1) {
              tensorData[i] = -1;
            }
          }
        }
        let newTensor = tf.tensor(tensorData, shape);
        mutatedWeights.push(newTensor);
      }
      this._model.setWeights(mutatedWeights);
    });
  }

  /**
   * @desc dada otra red neuronal mate (pareja) crea una nueva red neuronal hija mezclando los pesos de ambas. 
   *    La topología de ambas redes neuronales deben ser iguales
   * @param {NeuralNetwork} mate - La otra red neuronal que va a servir como pareja
   * @return {NeuralNetwork} La red neuronal hija resultado
   */ 
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
        let randomIndex = Math.random() * myTensorData.length;
        for (let j = 0; j < myTensorData.length; j++) {
          newValues.push((myTensorData[j] + otherTensorData[j]) / 2);
        }
        let newTensor = tf.tensor(newValues, shape);
        newWeights.push(newTensor);
      }
      newModel.setWeights(newWeights);
      return new NeuralNetwork(this._inputNodes, this._hiddenNodes, this._outputNodes, newModel);
    });
  }

  /**
   * @desc Método que dada una entrada, realiza una predicción con el modelo
   *    creado, en nuestro caso nos devuelve un array con las predicciones de 
   *    movimiento que hizo para la serpiente.
   * @param {Array} inputs - Array de entrada para realizar la predicción.
   * @return {Array} - Array con los resultados de la predicción.
   */
  predict(inputs) {
    return tf.tidy(() => {
      const inputData = tf.tensor2d([inputs]);
      const outputData = this._model.predict(inputData);
      return outputData.dataSync();
    });
  }

  /**
   * @desc Elimina de la memoria el modelo de la red neuronal.
   */
  dispose() {
    this._model.dispose();
  }
  
  /**
   * @desc Este método auxiliar sirve para crear un "modelo" de una red neuronal. Va a usar para el modelo
   *    los nodos de entrada, salida, y ocultas de esta neuralNetwork
   */
  createModel() {
    const model = tf.sequential();
    const hiddenLayer = tf.layers.dense({
      units: this._hiddenNodes[0],
      inputShape: [this._inputNodes],
      activation: 'linear'
    });
    model.add(hiddenLayer);
    for (let i = 1; i < this._hiddenNodes.length; i++) {
      const hiddenLayer = tf.layers.dense({
        units: this._hiddenNodes[i],
        inputShape: [this._hiddenNodes[i - 1]],
        activation: 'linear'
      });
      model.add(hiddenLayer);
    }
    const outputLayer = tf.layers.dense({
      units: this._outputNodes,
      activation: 'softmax'
    });
    model.add(outputLayer);
    return model;
  }
}