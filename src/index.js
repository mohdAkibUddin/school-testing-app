import React from 'react';
import ReactDOM from 'react-dom';
import './question-bank.css'

function QuestionCard(props) {
	return (
		<div className='question-card'>
			<div>
				<button>
					view
				</button>
			</div>
			<div>
				{props.value}
			</div>
			<div>
				<button>
					delete
				</button>
			</div>
		</div>
	);
}

class QuestionBoard extends React.Component {

	renderQuestionCard(value) {
		return (
			<QuestionCard value={value} />
		);
	}

	render() {
		let questionCards = [];
		const questions = getQuestions();
		for (let q in questions) {
			console.log();
			questionCards.push(<span key={q}>{this.renderQuestionCard(questions[q][0].function_name)}</span>);
		}
		return (
			<div className='outline'>
				<h1>Question Bank</h1>
				{questionCards}
			</div>
		);
	}
}

class AddQuestion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			question: props.question || '',
			function_name: props.function_name || '',
			types_input: props.types_input,
			types_output: props.types_output,
			testcases: props.testcases,
			testcaseCount: props.testcaseCount,
			difficulty: props.difficulty,
			categories: props.categories,
		}
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.addBox = this.addBox.bind(this);

	}

	handleSubmit() {
		console.log();
	}
	
	handleChange(event) {
		this.setState({
			[event.target.name] : event.target.value,
		});
	}

	addBox(event) {
		this.setState({
			testcaseCount: this.state.testcaseCount + 1,
		});
	}

	render() {
		let extraTestcaseBoxes = []

		for (let i = 1; i < this.state.testcaseCount; i++) {
			extraTestcaseBoxes.push(
				<div key={i}>
					<input name={i + ' in'} type='text' />
					<input name={i + ' out'} type='text' />
				</div>
			);
		}

		return (
			<div className='outline'>
				<form onSubmit={this.handleSubmit}>
					<label>
						<p>Question:</p>
						<textarea name='question' cols='30' rows='10'
							value={this.state.question}
							onChange={this.handleChange}
						/>
						<p>Function Name:</p>
						<input type='text' name='function_name'
							value={this.state.function_name}
							placeholder='func'
							onChange={this.handleChange}
						/>
						<p>Input Type(s) (Space Seperated)</p>
						<input type='text' name='types_input'
							value={this.state.types_input}
							placeholder='List[int] int'
							onChange={this.handleChange}
						/>
						<p>Output Type(s) (Space Seperated)</p>
						<input type='text' name='types_output'
							value={this.state.types_onput}
							placeholder='int'
							onChange={this.handleChange}
						/>
						<p>Tescases</p>
						<div>
							<input name={'0 in'} type='text' />
							<input name={'0 out'} type='text' />
						</div>
						{extraTestcaseBoxes}
						<input type='button' value='Add Case' onClick={this.addBox}/><br />
						<p>Difficulty</p>
						<input type='text' name='difficulty'
							value={this.state.difficulty}
							placeholder='medium'
							onChange={this.handleChange}
						/>
						<p>Categoeies</p>
						<input type='text' name='categories'
							value={this.state.difficulty}
							placeholder='recursion, memoization'
							onChange={this.handleChange}
						/>
					</label>
				</form>
			</div>

		);
	}
}

ReactDOM.render(
	<QuestionBoard />,
	document.getElementById('question-bank')
);

ReactDOM.render(
	<AddQuestion />,
	document.getElementById('add-question')
);

function getQuestions() {
	const questions = {
		'q1': [
			{ 'function_name': 'twoSum' },
			{ 'question': 'lorem ipsum' },
			{
				'testcases': [
					{ 'input1': 'output1' },
					{ 'input2': 'output2' }
				]
			},
			{ 'difficulty': 'easy' },
			{
				'categories': [
					'maps', 'iteration'
				]
			}
		],
		'q2': [
			{ 'function_name': 'travelingSalesman' },
		],
		'q3': [
			{ 'function_name': 'addUpChange' },
		],
		'q4': [
			{ 'function_name': 'climbingStairs' },
		]
	};

	return questions;
}