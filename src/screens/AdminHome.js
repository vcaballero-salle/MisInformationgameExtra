import {Component} from 'react';
import '../App.css';
import {getDataManager} from "../model/manager";
import {Link} from "react-router-dom";
import StudyUpload from "../components/StudyUpload";
import {ErrorLabel, ProgressLabel} from "../components/StatusLabel";
import UploadIcon from '@mui/icons-material/Upload';
import {isOfType} from "../utils/types";
import {BrokenStudy} from "../model/study";
import {MountAwareComponent} from "../components/MountAwareComponent";


class StudySummary extends Component {
    render() {
        const study = this.props.study;
        // Handle broken studies specially.
        if (isOfType(study, BrokenStudy)) {
            return (
                <div className="rounded-xl border border-red-800 p-3 bg-white shadow">
                    <Link to={`/admin/${study.id}`}
                          className="text-red-500 text-lg font-bold hover:text-red-700 hover:underline">
                        {study.name}
                    </Link>

                    <p dangerouslySetInnerHTML={{__html: study.description}} />
                    <ErrorLabel className="mt-3" value={[<b>This study is broken:</b>, study.error]} />
                </div>
            );
        }

        return (
            <div className={"rounded-xl border p-3 bg-white shadow " +
                            (study.enabled ? "border-green-600" : "border-gray-400")}>

                {study.enabled &&
                    <span className="inline-block w-3.5 h-3.5 mr-2 bg-green-500 rounded-full"
                          title="Study is Enabled" />}

                <Link to={`/admin/${study.id}`}
                      className={"text-lg font-bold hover:underline " +
                                 (study.enabled ? "text-green-600 hover:text-green-700" :
                                                  "text-blue-600 hover:text-blue-700")}>

                    {study.name}
                </Link>
                
                <p dangerouslySetInnerHTML={{__html: study.description}} />
            </div>
        );
    }
}

class UploadStudyButton extends Component {
    render() {
        return (
            <div className="flex justify-around items-center rounded-xl
                            bg-gray-100 cursor-pointer hover:bg-blue-100 hover:shadow
                            border-2 border-dashed border-gray-800 overflow-hidden"
                 style={{minHeight: "8rem"}}
                 onClick={this.props.onClick}>

                <p className="text-xl font-semibold">
                    <UploadIcon className="mr-1" />
                    Upload New Study
                </p>
            </div>
        );
    }
}

class AdminPage extends MountAwareComponent {
    constructor(props) {
        super(props);
        this.state = {
            studies: null,
            showUpload: false
        };
    }

    componentDidMount() {
        super.componentDidMount();
        getDataManager().getAllStudies().then((studies) => {
            this.setStateIfMounted({
                studies: studies,
                showUpload: this.state.showUpload
            });
        });
    }

    showStudyUpload() {
        this.setState({
            studies: this.state.studies,
            showUpload: true
        });
    }

    hideStudyUpload() {
        this.setState({
            studies: this.state.studies,
            showUpload: false
        });
    }

    afterStudyUpload(study) {
        // Refresh the list of all studies.
        const manager = getDataManager();
        manager.clearCachedStudies();
        manager.cacheStudy(study);

        // Move to the study page for the uploaded study.
        this.props.history.push("/admin/" + study.id);
    }

    render() {
        const studies = this.state.studies || [];
        const readStudies = this.state.studies !== null;
        const noStudies = readStudies && studies.length === 0;

        const studyComponents = [];
        for (let index = 0; index < studies.length; ++index) {
            const study = studies[index];
            studyComponents.push((
                <StudySummary study={study} key={study.id} />
            ));
        }

        return (
            <div className="min-h-screen w-full bg-gray-100" >
                {/* The navigation bar. */}
                <div className="flex items-stretch justify-between w-full bg-white shadow">
                    <Link to="/" className="font-bold text-xl p-3">
                        Misinformation Game
                    </Link>
                    <div className="bg-blue-400 p-3 text-xl text-white font-medium
                                    hover:bg-blue-500 cursor-pointer select-none"
                         onClick={() => this.showStudyUpload()}>

                        <UploadIcon className="mr-1" />
                        Upload Study
                    </div>
                </div>

                <div className="w-full p-10">
                    {/* The studies. */}
                    {readStudies && !noStudies &&
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
                        {studyComponents}
                        <UploadStudyButton onClick={() => this.showStudyUpload()}/>
                    </div>}

                    {/* Label saying that the studies are loading. */}
                    {noStudies &&
                        <ErrorLabel value={[
                            "No studies were found.",
                            "You can upload a study using the ",
                            <b>Upload Study</b>,
                            "button in the top-right of this page."
                        ]} />}

                    {/* Label saying that the studies are loading. */}
                    {!readStudies &&
                        <ProgressLabel value="Loading studies..." />}
                </div>

                {/* Allows new studies to be uploaded. */}
                <StudyUpload title="Upload Study"
                             visible={this.state.showUpload}
                             onHide={() => this.hideStudyUpload()}
                             onUpload={(study) => this.afterStudyUpload(study)} />
            </div>
        );
    }
}

export default AdminPage;

