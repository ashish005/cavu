import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {CourseSeed, CourseSeedQueryOptions, CourseToBeUplooad} from "../domains/course-seed.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseSeederAPIResolver} from "../services/api.resolver";
import {CourseSeedService} from "../services/course-seeder.service";

@Component({
  standalone: false,
  templateUrl: './templates/seed-coures.html',
  //styles: [`:host {display: contents;}`]
  styles: [`:host ::ng-deep drop-down button { font-size: .7rem !important; }`]
})
export class SeedCouresView implements OnInit {
  public activeStream: any = {
    key: '',
    name: '',
    isLoading: false,
    activeKey: null,
    courses: []
  };
  masterCourses: Array<any>;

  public streamData = {
    studyStreamId: null,
  };

  activeCourses: Array<any>;
  programMapping: any;
  programIdMapping: any;
  streamOptions: any = {title: 'Stream', label: 'name', key: 'studyStreamId', listKey: 'id'};
  constructor(public fb: FormBuilder,
              public router: Router,
              public activeRoute: ActivatedRoute,
              public apiResolver: CourseSeederAPIResolver,
              public service: CourseSeedService) {
    this.activeRoute.params.subscribe(params => {
      this.activeStream.key = params['key'];
      if (params && params['key']) {
        this.fetchDataByKey(params['key']);
      } else {
        this.activeStream.courses =  [];
        this.activeCourses = [];
      }
    });
  }

  ngOnInit() {
    this.updateProgramMapping();
      this.service.list(new CourseSeedQueryOptions()).subscribe((resp) => {
          this.masterCourses = resp.entities;
      });
  }
  navigateToKey(stream: any){
      this.router.navigate([stream.key], {relativeTo: this.activeRoute.parent});
  }

  updateProgramMapping() {
   this.programIdMapping = this.apiResolver.masterType.studyProgram.reduce((result, item)=>{
      result[item.name] = item;
      return result;
    }, {});
    const masterTypes = this.apiResolver.masterType.staticMasterType;

    const dt_YearId = masterTypes.duration.find(r => r.name == "Year").id;
    const dt_MonthId = masterTypes.duration.find(r => r.name == "Month").id;
    const dt_DayId = masterTypes.duration.find(r => r.name == "Day").id;

    const dt_noneId = masterTypes.durationTerms.find(r => r.name == "None").id;
    const dt_semesterId = masterTypes.durationTerms.find(r => r.name == "Semester").id;
    const dt_tremesterId = masterTypes.durationTerms.find(r => r.name == "Tremester").id;

    const q_10th_passId = masterTypes.qualification.find(r => r.name == "10th Pass").id;
    const q_12th_passId = masterTypes.qualification.find(r => r.name == "12th Pass").id;
    const q_graduateId = masterTypes.qualification.find(r => r.name == "Graduate").id;
    const q_post_graduateId = masterTypes.qualification.find(r => r.name == "Post Graduate").id;

    this.programMapping = {
      "B.Sc": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "M.Sc": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.F.A.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "B.V.C.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 2, durationTerm: dt_noneId},
      "M.F.Sc.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.F.Tech.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.P.A.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.P.A. (Hons.)": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.Phil.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.Sc.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.Sc. (H.Sc.)": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.Sc. (Hons.)": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.Ed.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.T.T.M.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.V.A.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.V.Sc.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.V.Sc. & A.H.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "Ph.D.": {eligibility: q_post_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "L.L.M.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.Arch.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "D.Litt.": {eligibility: q_post_graduateId, durationType: dt_YearId, duration: 5, durationTerm: dt_noneId},
      "M.A. + Ph.D.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 5, durationTerm: dt_noneId},
      "M.Phil. + Ph.D.": {eligibility: q_post_graduateId, durationType: dt_YearId, duration: 5, durationTerm: dt_noneId},
      "M.Tech.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.B.A.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "M.A.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_semesterId},
      "L.L.B.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.Tech.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 4, durationTerm: dt_semesterId},
      "B.T.A.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.Sc. + M.Sc.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.Sc. (Hons.)": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.Sc. (H.Sc.)": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.Sc.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.P.A.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.L.S.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.F.A.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.El.Ed.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.Ed.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.E.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "M.E.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_noneId},
      "B.Design": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.B.A.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.A. + M.A.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 5, durationTerm: dt_noneId},
      "B.A. + B.Ed.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 5, durationTerm: dt_noneId},
      "B.A. (Hons)": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.A.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "B.V.Sc": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "BS + MS": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 5, durationTerm: dt_noneId},
      "B.Arch.": {eligibility: q_12th_passId, durationType: dt_YearId, duration: 3, durationTerm: dt_noneId},
      "M.Sc. + M.Phil": {eligibility: q_graduateId, durationType: dt_YearId, duration: 4, durationTerm: dt_noneId},
      "M.S.": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_noneId},
      "Other": {eligibility: q_graduateId, durationType: dt_YearId, duration: 2, durationTerm: dt_noneId},
    };
  }

  showByDegreeType(degreeType: any) {
    this.activeStream.activeKey = degreeType.id;
    this.activeCourses = this.activeStream.courses.filter(r => r.studyDegreeId == degreeType.id);
  }

  showUnmappedCourses() {
    this.activeStream.activeKey = 'unmapped';
    this.activeCourses = this.activeStream.courses.filter(r => !r.studyDegreeId);
  }

  fetchCourse(stream: any) {
    this.activeStream.key = stream.key;
    this.activeStream.name = stream.name;
    this.activeStream.isLoading = true;
  }

  mapOtherFields(data: CourseToBeUplooad){
    const d = (data.abbreviation || '').split(' ');
    const keyProgram = d[0];
    const dItem = this.programMapping[keyProgram] || this.programMapping['Other'];
    if(dItem){
      data.eligibility = dItem.eligibility;
      data.durationType = dItem.durationType;
      data.durationYear = dItem.duration;
      data.duration = dItem.duration;
      data.durationTerm = dItem.durationTerm;

      const program = this.programIdMapping[keyProgram] || this.programIdMapping['Other'];
      if(program){
        data.studyProgramId = program.id;
        data.studyLevelId = program.studyLevelId;
        data.studyOther = (program.name == 'Other');
      }
    }

    if(!data.name){
      data.name = data.abbreviation;
      data.abbreviation = null;
    }
    return data;
  }

  fetchDataByKey(key: string) {
    const studyDegree = this.apiResolver?.masterType?.studyDegree.find(r => r.name == 'Degree');
    const studyDiploma = this.apiResolver?.masterType?.studyDegree.find(r => r.name == 'Diploma');
    const studyCertificate = this.apiResolver?.masterType?.studyDegree.find(r => r.name == 'Certificate');

    this.activeStream.isLoading = true;

    const success = (resp)=> {
        this.activeStream.isLoading = false;
        const {degree, diploma, certificate} = resp.entities;
        const deg = (degree || []).map(r => {
            r.studyDegreeId = studyDegree?.id;
            const data = new CourseToBeUplooad(r);
            return this.mapOtherFields(data);
        });
        const dip = (diploma || []).map(r => {
            r.studyDegreeId = studyDiploma?.id;
            const data = new CourseToBeUplooad(r);
            return this.mapOtherFields(data);
        });
        const cert = (certificate || []).map(r => {
            r.studyDegreeId = studyCertificate?.id;
            const data = new CourseToBeUplooad(r);
            return this.mapOtherFields(data);
        });
        this.activeStream.courses = [...deg, ...dip, ...cert];
        this.showByDegreeType(studyDegree);
    };

    const error = (err)=> {
        this.activeStream.isLoading = false;
    };

    this.service.getCoursesByStreamKey(key).subscribe((resp)=>{
      setTimeout((data)=>{ success(data); }, 100, resp);
    }, error);
  }

  saveCourses(stream: CourseSeed) {
    if(!this.streamData.studyStreamId){
      alert("Please provide Streame")
    }
    if(stream.isUpdating){
        return;
    }
    stream.isUpdating = true;

    const studyDegree = this.apiResolver?.masterType?.studyDegree.find(r => r.name == 'Degree') || {id: null};
    const studyDiploma = this.apiResolver?.masterType?.studyDegree.find(r => r.name == 'Diploma') || {id: null};
    const studyCertificate = this.apiResolver?.masterType?.studyDegree.find(r => r.name == 'Certificate') || {id: null};

    const itemData = stream?.courses.reduce((result, curr: any) => {
      curr.studyStreamId = this.streamData.studyStreamId;
      if (!result[curr.studyDegreeId]) {
        result[curr.studyDegreeId] = [];
      }
      result[curr.studyDegreeId].push(curr);
      return result;
    }, {});

    const data: any = {
      degree: itemData[studyDegree.id],
      diploma: itemData[studyDiploma.id],
      certificate: itemData[studyCertificate.id],
    };

    this.service.updateCourseByKey(data, stream.key).subscribe((resp) => {
      stream.isUpdating = false;
    }, (err) => {
      stream.isUpdating = false;
    });
  }
}
