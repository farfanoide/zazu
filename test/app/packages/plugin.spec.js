import path from 'path'
import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import Plugin from '../../../app/packages/plugin'
import Block from '../../../app/blocks/block'
const { expect } = chai

chai.use(sinonChai)

const blockFactory = (responds, connections) => {
  const block = new Block({
    type: 'noop',
    connections,
  })
  sinon.spy(block, 'call')
  return block
}

describe('Plugin', () => {
  let plugin = new Plugin('tinytacoteam/calculator')

  describe('transformResults', () => {
    beforeEach(() => {
      plugin = new Plugin('tinytacoteam/calculator')
    })

    describe('give me the default icon', () => {
      const results = plugin.transformResults(10, [{ icon: '' }])
      expect(results.length).to.eq(1)
      expect(results[0].icon).to.eq('fa-bolt')
    })

    describe('keeps font awesome icon', () => {
      const results = plugin.transformResults(10, [{ icon: 'fa-wifi' }])
      expect(results.length).to.eq(1)
      expect(results[0].icon).to.eq('fa-wifi')
    })

    describe('adds the plugin path to the icon', () => {
      plugin.path = '/abc'
      const results = plugin.transformResults(10, [{ icon: 'meow' }])
      expect(results.length).to.eq(1)
      expect(results[0].icon).to.eq(path.join('/abc', 'meow'))
    })
  })

  describe('next', () => {
    beforeEach(() => {
      plugin.inputs = []
      plugin.outputs = []
      plugin.blocksById = {}
    })

    it('when an input has no links', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addInput(blockFactory(true))

      // Execution
      const state = { blockId: plugin.inputs[0].id }
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.not.have.been.calledOnce
      expect(plugin.outputs[1].call).to.not.have.been.calledOnce
    })
    it('when an input has one link', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addInput(blockFactory(true, [plugin.outputs[0].id]))

      // Execution
      const state = { blockId: plugin.inputs[0].id }
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.not.have.been.calledOnce
    })
    it('when and input has two links', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addInput(blockFactory(true, [plugin.outputs[0].id, plugin.outputs[1].id]))

      // Execution
      const state = { blockId: plugin.inputs[0].id }
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.have.been.calledOnce
    })
    it('works with deep output linking', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true, [plugin.outputs[0].id]))
      plugin.addInput(blockFactory(true, [plugin.outputs[1].id, plugin.outputs[2].id]))

      // Execution
      const state = { blockId: plugin.inputs[0].id }
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.have.been.calledOnce
      expect(plugin.outputs[2].call).to.have.been.calledOnce
    })
  })
})
