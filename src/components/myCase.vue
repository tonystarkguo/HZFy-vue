<template>
    <div class="main myCase" v-loading.fullscreen.lock="loading" v-loading="loading">
        <div class="tc" v-show="tcShow">
            <img :src="tcUrl">
            <el-button @click="offTc">关闭</el-button>
        </div>
        <el-steps :active="dicCaseStatus>17||dicCaseStatus==0?2:1" align-center>
            <el-step title="承办中"></el-step>
            <el-step title="结案审核完成"></el-step>
        </el-steps>
        <dl class="information">
            <dt>案件信息</dt>
            <dd>
                <span>受援人姓名：</span>
                <b>{{caseDetail.rpName}}</b>
            </dd>
            <dd>
                <span>受援人性别：</span>
                <b>{{caseDetail.rpGender}}</b>
            </dd>
            <dd>
                <span>联系电话：</span>
                <b>{{caseDetail.rpMobile}}</b>
            </dd>
            <dd>
                <span>人员类别：</span>
                <b><i v-for="item in caseDetail.dicConsultantCategoryList">{{item.labelName}}</i></b>
            </dd>
            <dd>
                <span>法律状态及地位：</span>
                <b>{{caseDetail.lawStanding}}</b>
            </dd>
            <dd>
                <span>援助方式：</span>
                <b>{{caseDetail.aidWay}}</b>
            </dd>
            <dd>
                <span>案由：</span>
                <b>{{caseDetail.reasonName}}</b>
            </dd>
            <dd>
                <span>案情概括：</span>
                <b>{{caseDetail.caseDetail}}</b>
            </dd>
        </dl>
        <!-- 
            民事案件:1                 > 办理手续,询问笔录,阅卷,              调查取证,开庭,结案通报,其他
            民事案件-劳动仲裁:2        > 办理手续,询问笔录,                   调查取证,开庭,结案通报,其他
            行政案件:3                 > 办理手续,询问笔录,阅卷,              调查取证,开庭,结案通报,其他
            刑事案件-申请-代理:4       > 办理手续,询问笔录,阅卷,会见,会见笔录,调查取证,开庭,结案通报,其他
            刑事案件-申请-非代理:5     > 办理手续,询问笔录,阅卷,会见,会见笔录,调查取证,开庭,结案通报,其他
            刑事案件-通知|商请-代理:6  > 办理手续,         阅卷,会见,会见笔录,调查取证,开庭,结案通报,其他
            刑事案件-通知|商请-非代理:7> 办理手续,         阅卷,会见,会见笔录,调查取证,开庭,结案通报,其他
        -->
        <el-form :model="undertake" ref="undertake" :disabled='!isEdit'>
            <el-tabs v-model="tabsActive" v-if="!loading" class="tabs">
                <el-tab-pane label="案件承办" name="undertake" class="undertake">
                    <el-collapse accordion>
                        <el-collapse-item title="办理手续">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">办理情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.procedure.dicHandle" placeholder="请选择">
                                                <el-option v-for="item in undertake.procedure.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.procedure.dicHandle=='1'">
                                    <el-row>
                                        <el-col :span="8">办理时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.procedure.handledTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.procedure.dicHandle=='2'">
                                    <input type="text" v-model="undertake.procedure.unhandledReason" placeholder="请输入未办理原因" />
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">指派通知书</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'指派通知书',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[0].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">委托协议</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'委托协议',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[1].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">授权委托书</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'授权委托书',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[2].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item v-show="caseType!='6' && caseType!='7'" title="询问笔录">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.record.dicTranscript" placeholder="请选择">
                                                <el-option v-for="item in undertake.record.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.record.dicTranscript=='1'">
                                    <el-row>
                                        <el-col :span="8">制作时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.record.transcriptTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.record.dicTranscript=='2'">
                                    <input type="text" v-model="undertake.record.untranscriptReason" placeholder="请输入未制作原因" />
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">询问笔录</el-col>
                                        <el-col :span="16">
                                            <el-col :span="16">
                                                <el-upload :action="upLoadApi" :data="{name:'询问笔录',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[3].fileList" :on-preview='openPngUrl' class="upload">
                                                    <el-button size="small" type="primary">点击上传</el-button>
                                                </el-upload>
                                            </el-col>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item v-show="caseType!='2'" title="阅卷">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.read.dicMarking" placeholder="请选择">
                                                <el-option v-for="item in undertake.read.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.read.dicMarking=='1'">
                                    <el-row>
                                        <el-col :span="8">阅卷时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.read.markingTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.read.dicMarking=='2'">
                                    <input type="text" v-model="undertake.read.unmarkingReason" placeholder="请输入未阅卷原因" />
                                </dd>
                                <dd v-show="caseType!='1' && caseType!='3'">
                                    <el-row>
                                        <el-col :span="8">阅卷材料</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'阅卷材料',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[4].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item v-show="caseType!='1' && caseType!='2' && caseType!='3'" title="会见">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.meet.dicMeet" placeholder="请选择">
                                                <el-option v-for="item in undertake.meet.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.meet.dicMeet=='1'">
                                    <el-row>
                                        <el-col :span="8">会见时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.meet.meetTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.meet.dicMeet=='2'">
                                    <input type="text" v-model="undertake.meet.unmeetReason" placeholder="请输入未会见原因" />
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">会见专用证明</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'会见专用证明',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[5].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item v-show="caseType!='1' && caseType!='2' && caseType!='3'" title="会见笔录">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.meetRecord.dicMeetRecord" placeholder="请选择">
                                                <el-option v-for="item in undertake.meetRecord.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.meetRecord.dicMeetRecord=='1'">
                                    <el-row>
                                        <el-col :span="8">制作时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.meetRecord.meetRecordTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.meetRecord.dicMeetRecord=='2'">
                                    <input type="text" v-model="undertake.meetRecord.unmeetRecordReason" placeholder="请输入未制作原因" />
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">会见笔录</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'会见笔录',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[6].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item title="调查取证">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.obtainEvidence.dicEvidence" placeholder="请选择">
                                                <el-option v-for="item in undertake.obtainEvidence.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.obtainEvidence.dicEvidence=='1'">
                                    <el-row>
                                        <el-col :span="8">取证时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.obtainEvidence.evidenceTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.obtainEvidence.dicEvidence=='2'">
                                    <input type="text" v-model="undertake.obtainEvidence.unevidenceReason" placeholder="请输入未取证原因" />
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">证据材料</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'证据材料',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[7].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item title="开庭">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.session.dicSession" placeholder="请选择">
                                                <el-option v-for="item in undertake.session.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.session.dicSession=='1'">
                                    <el-row>
                                        <el-col :span="8">开庭时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.session.sessionTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.session.dicSession=='2'">
                                    <input type="text" v-model="undertake.session.unsessionReason" placeholder="请输入未开庭原因" />
                                </dd>
                                <dd>
                                    <el-row v-if="caseType=='5' || caseType=='7'">
                                        <el-col :span="8">辩护词</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'辩护词',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[8].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                    <el-row v-else>
                                        <el-col :span="8">代理词</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'代理词',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[8].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">庭审笔录</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'庭审笔录',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[9].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item title="结案通报">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">承办情况</el-col>
                                        <el-col :span="16">
                                            <el-select v-model="undertake.notification.dicBanjie" placeholder="请选择">
                                                <el-option v-for="item in undertake.notification.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.notification.dicBanjie=='1'">
                                    <el-row>
                                        <el-col :span="8">通报时间</el-col>
                                        <el-col :span="16">
                                            <el-date-picker size="mini" value-format='timestamp' v-model="undertake.notification.banjieTime" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd v-show="undertake.notification.dicBanjie=='2'">
                                    <input type="text" v-model="undertake.notification.unbanjieReason" placeholder="请输入未通报原因" />
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">裁判文书</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:'裁判文书',policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[10].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <el-collapse-item title="其他承办材料" class="last">
                            <dl>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">材料类型</el-col>
                                        <el-col :span="16" class="materials">
                                            <el-select v-on:change="clBack()" v-model="undertake.materials.selectValue" placeholder="请选择">
                                                <el-option v-for="item in undertake.materials.options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </dd>
                                <dd>
                                    <el-row>
                                        <el-col :span="8">上传材料</el-col>
                                        <el-col :span="16">
                                            <el-upload :action="upLoadApi" :data="{name:otherName,policy:policy}" :accept="accept" :on-success="getImgUrl" :on-remove="fileRemove" :file-list="resources[otherNum].fileList" :on-preview='openPngUrl' class="upload">
                                                <el-button size="small" type="primary">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>
                                </dd>
                            </dl>
                        </el-collapse-item>
                        <dl class="result">
                            <dt>案件办理结果</dt>
                            <dd>
                                <el-input v-model="result.handlingOrg" placeholder="请输入办案机关">
                                    <template slot="prepend">办案机关</template>
                                </el-input>
                            </dd>
                            <dd>
                                <el-row>
                                    <el-col :span="8">结案文书</el-col>
                                    <el-col :span="16">
                                        <el-select v-model="result.dicClosingDoc" placeholder="请选择">
                                            <el-option v-for="item in result.writOptions" :key="item.code" :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </dd>
                            <dd>
                                <el-input v-model="result.docNumber" placeholder="请输入文号">
                                    <template slot="prepend">文号</template>
                                </el-input>
                            </dd>
                            <dd>
                                <el-row>
                                    <el-col :span="8">结案方式</el-col>
                                    <el-col :span="16">
                                        <el-cascader :props="props" :options="result.wayOptions" v-model="result.wayValue">
                                        </el-cascader>
                                    </el-col>
                                </el-row>
                            </dd>
                            <dd>
                                <el-row>
                                    <el-col :span="8">案件效果</el-col>
                                    <el-col :span="16">
                                        <el-cascader :props="props" :options="result.effectOptions" v-model="result.effectValue">
                                        </el-cascader>
                                    </el-col>
                                </el-row>
                            </dd>
                            <dd>
                                <el-row>
                                    <el-col :span="8">上诉情况</el-col>
                                    <el-col :span="16">
                                        <el-select v-model="result.dicAppeal" placeholder="请选择">
                                            <el-option v-for="item in result.appealOptions" :key="item.code" :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </dd>
                            <dd>
                                <el-row>
                                    <el-col :span="8">代写上诉状</el-col>
                                    <el-col :span="16">
                                        <el-select v-model="result.dicAppealForm" placeholder="请选择">
                                            <el-option v-for="item in result.ghostwriteOptions" :key="item.code" :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </dd>
                            <dd>
                                <el-input maxlength="6" v-model="result.saveLosses" placeholder="挽回经济损失">
                                    <template slot="prepend">挽回经济损失</template>
                                    <template slot="append">元</template>
                                </el-input>
                            </dd>
                            <dd>
                                <el-input maxlength="6" v-model="result.pleasePay" placeholder="为农民工讨薪">
                                    <template slot="prepend">为农民工讨薪</template>
                                    <template slot="append">元</template>
                                </el-input>
                            </dd>
                            <dd>
                                <h4>办案小结</h4>
                                <el-input maxlength="2000" type="textarea" :rows="2" placeholder="请输入办案小结" v-model="result.summary">
                                </el-input>
                                <!-- <textarea maxlength="2000" minlength="50" placeholder="请输入办案小结" v-model="result.summary"></textarea> -->
                            </dd>
                        </dl>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="文书类材料" name="materials">
                    <div class="tabsContent materialsList">
                        <el-row v-for="item in materialDocs">
                            <el-col :span="14">{{item.name}}</el-col>
                            <el-col :span="10">
                                <a class="check" @click="openHtml(item.addrUrl)">查看</a>
                                <el-upload :action="upLoadApi" :data="{id:item.tCaseMaterialStorageId,policy:policy}" :accept="accept" :on-success="getImgUrl" class="upload">
                                    <el-button size="small" type="primary">上传</el-button>
                                </el-upload>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="事项日志" name="log">
                    <div class="tabsContent">
                        <el-steps direction="vertical" :active="caseProgressLog.length">
                            <el-step v-for="item in caseProgressLog" :title="item.logTitle + ' ' +item.createTime + ' ' + item.creatorName" :description="item.logMessage"></el-step>
                        </el-steps>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <p>
                <template v-if="isSave">
                    <el-button class="submitCase" @click="subCase(1)">保存</el-button>
                </template>
                <template v-if="isEdit">
                    <el-button class="submitCase" type="primary" @click="subCase(2)">提交结案</el-button>
                </template>
            </p>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'myCase',
    data() {
        return {
            props: {
                value: 'code',
                label: 'name',
                children: 'children'
            },
            tcShow: false,
            tcUrl: '',
            loading: true,
            isEdit: true,
            isSave: true,
            dicStatus: '',
            dicCaseStatus: '',
            caseId: this.$route.params.caseId.split('_')[0],
            isChange: this.$route.params.caseId.split('_')[1],
            caseType: '',
            dictData: getLs('config').dictData,
            policy: JSON.stringify(getLs('policy')),
            upLoadApi: '/h5/api/upLoad',
            accept: 'image/*',
            caseDetail: {}, //受援人信息
            materialDocs: [], //文书类材料
            caseProgressLog: [], //事项日志
            ossData: {}, //授权信息
            tabsActive: 'undertake',
            //案件承办
            undertake: {
                //办理手续
                procedure: {
                    options: [{
                        value: '1',
                        label: '已办理'
                    }, {
                        value: '2',
                        label: '未办理'
                    }],
                    dicHandle: '',
                    handledTime: '',
                    unhandledReason: '',
                },
                //询问笔录
                record: {
                    options: [{
                        value: '1',
                        label: '已制作'
                    }, {
                        value: '2',
                        label: '未制作'
                    }],
                    dicTranscript: '',
                    transcriptTime: '',
                    untranscriptReason: '',
                },
                //阅卷
                read: {
                    options: [{
                        value: '1',
                        label: '已阅'
                    }, {
                        value: '2',
                        label: '未阅'
                    }],
                    dicMarking: '',
                    markingTime: '',
                    unmarkingReason: '',
                },
                //会见
                meet: {
                    options: [{
                        value: '1',
                        label: '已会见'
                    }, {
                        value: '2',
                        label: '未会见'
                    }],
                    dicMeet: '',
                    meetTime: '',
                    unmeetReason: '',
                },
                //会见笔录
                meetRecord: {
                    options: [{
                        value: '1',
                        label: '已制作'
                    }, {
                        value: '2',
                        label: '未制作'
                    }],
                    dicMeetRecord: '',
                    meetRecordTime: '',
                    unmeetRecordReason: '',
                },
                //调查取证
                obtainEvidence: {
                    options: [{
                        value: '1',
                        label: '已取证'
                    }, {
                        value: '2',
                        label: '未取证'
                    }],
                    dicEvidence: '',
                    evidenceTime: '',
                    unevidenceReason: '',
                },
                //开庭
                session: {
                    options: [{
                        value: '1',
                        label: '已开庭'
                    }, {
                        value: '2',
                        label: '未开庭'
                    }],
                    dicSession: '2',
                    sessionTime: '',
                    unsessionReason: '',
                },
                //结案通报
                notification: {
                    options: [{
                        value: '1',
                        label: '已通报'
                    }, {
                        value: '2',
                        label: '未通报'
                    }],
                    dicBanjie: '',
                    banjieTime: '',
                    unbanjieReason: '',
                },
                //其他承办材料
                materials: {
                    options: [],
                    selectValue: '',
                }
            },
            //文件列表
            resources: [
                { dicCategory: '指派通知书', undertakeResources: [], fileList: [] }, //办理手续-指派通知书
                { dicCategory: '委托协议', undertakeResources: [], fileList: [] }, //办理手续-委托协议
                { dicCategory: '授权委托书', undertakeResources: [], fileList: [] }, //办理手续-授权委托书

                { dicCategory: '询问笔录', undertakeResources: [], fileList: [] }, //询问笔录-询问笔录

                { dicCategory: '阅卷材料', undertakeResources: [], fileList: [] }, //阅卷-阅卷材料

                { dicCategory: '会见专用证明', undertakeResources: [], fileList: [] }, //会见-会见专用证明

                { dicCategory: '会见笔录', undertakeResources: [], fileList: [] }, //会见笔录-会见笔录

                { dicCategory: '证据材料', undertakeResources: [], fileList: [] }, //调查取证-证据材料

                { dicCategory: '代理词', undertakeResources: [], fileList: [] }, //开庭-代理词 || 辩护词

                { dicCategory: '庭审笔录', undertakeResources: [], fileList: [] }, //开庭-庭审笔录

                { dicCategory: '裁判文书', undertakeResources: [], fileList: [] }, //结案通报-裁判文书

                //其他承办材料
                { dicCategory: "民事起诉状或答辩状、上诉状", undertakeResources: [], fileList: [] },
                { dicCategory: "人民调解书", undertakeResources: [], fileList: [] },
                { dicCategory: "和解协议书", undertakeResources: [], fileList: [] },
                { dicCategory: "申诉书或再审申请书", undertakeResources: [], fileList: [] },
                { dicCategory: "劳动仲裁申请书", undertakeResources: [], fileList: [] },
                { dicCategory: "刑事辩护（代理）意见书", undertakeResources: [], fileList: [] },
                { dicCategory: "刑事附带民事诉状", undertakeResources: [], fileList: [] },
                { dicCategory: "其他材料", undertakeResources: [], fileList: [] },
            ],
            resourcesList: [],
            //其他承办材料的name;
            otherName: null,
            otherNum: 18,
            //案件办理结果
            result: {
                handlingOrg: '',
                writOptions: [], //结案文书
                dicClosingDoc: '',
                docNumber: '',
                wayOptions: [], //结案方式
                wayValue: [],
                effectOptions: [], //结案效果
                effectValue: [],
                appealOptions: [], //上诉情况
                dicAppeal: '',
                ghostwriteOptions: [], //代写上诉状
                dicAppealForm: '',
                saveLosses: '',
                pleasePay: '',
                summary: ''
            },
            fileDate: new Date(),
            files: [],
            filesIsUp: true
        }
    },
    watch: {
        //办理手续
        "undertake.procedure.dicHandle": function(val, old) {
            this.deleteValue(val, old, 'procedure');
        },
        //询问笔录
        "undertake.record.dicTranscript": function(val, old) {
            this.deleteValue(val, old, 'record');
        },
        //阅卷
        "undertake.read.dicMarking": function(val, old) {
            this.deleteValue(val, old, 'read');
        },
        //调查取证
        "undertake.obtainEvidence.dicEvidence": function(val, old) {
            this.deleteValue(val, old, 'obtainEvidence');
        },
        //会见
        "undertake.meet.dicMeet": function(val, old) {
            this.deleteValue(val, old, 'meet');
        },
        //会见笔录
        "undertake.meetRecord.dicMeetRecord": function(val, old) {
            this.deleteValue(val, old, 'meetRecord');
        },
        //开庭
        "undertake.session.dicSession": function(val, old) {
            this.deleteValue(val, old, 'session');
        },
        //结案通报
        "undertake.notification.dicBanjie": function(val, old) {
            this.deleteValue(val, old, 'notification');
        },
    },
    mounted() {
        this.getUndertakeCaseResult();
        this.getCaseDetai();
        this.getMaterialDocs();
        this.getCaseProgressLog();
        this.assembleOptions();
    },
    methods: {
        //其他材料 回调
        clBack() {
            var that = this,
                materials = that.undertake.materials;

            for (let i = 0; i < materials.options.length; i++) {
                if (materials.options[i].value == materials.selectValue) {
                    that.otherName = materials.options[i].label;
                }
            }

            for (let i = 0; i < that.resources.length; i++) {
                if (that.resources[i].dicCategory == that.otherName) {
                    that.otherNum = i;
                }
            }
            // console.log(that.resources[])
            // console.log(that.resources[that.otherNum])
            // console.log(that.otherName)
            // console.log(that.otherNum)
        },
        //案件承办-清除未办理原因或者时间
        deleteValue(val, old, name) {
            if (old) {
                var that = this,
                    obj = that.undertake[name],
                    time, reason;
                for (let key in obj) {
                    if (key.indexOf('Time') != -1) {
                        time = key;
                    }
                    if (key.indexOf('Reason') != -1) {
                        reason = key;
                    }
                }
                if (val == '1') { //未办理 清除办理时间
                    that.undertake[name][reason] = '';
                }
                if (val == '2') { //已办理 清除办理时间
                    that.undertake[name][time] = '';
                }
            }
        },
        //删除文件
        fileRemove(file, fileList) {
            //删除resources里的filelist对应的obj
            // console.log('====================================')
            // console.log(fileList)
            var that = this;

            for (let i = 0; i < that.resources.length; i++) {
                //删除fileList
                for (let f = 0; f < that.resources[i].fileList.length; f++) {
                    if (that.resources[i].fileList[f].uid == file.uid) {
                        if (fileList.length != 0) {
                            that.resources[i].fileList = fileList;
                        } else {
                            that.resources[i].fileList = [];
                        }
                    }
                }
                //删除undertakeResources
                for (let f = 0; f < that.resources[i].undertakeResources.length; f++) {
                    if (that.resources[i].undertakeResources[f].objectKey == file.key) {
                        that.resources[i].undertakeResources[f].isDelete = 1;
                    }
                }
            }
            // console.log(this.resources[2].fileList)
        },
        //获取selelct的option集合并处理
        assembleOptions: function() {
            var that = this;
            var dictData = that.dictData;
            // console.log(dictData);

            var dicClosingDoc = dictData.dic_dic_closing_doc; //结案文书

            var method = dictData.dic_dic_closing_method; //结案方式一级
            var methodTo = dictData.dic_dic_closing_method_to; //结案方式二级

            var effect = dictData.dic_dic_case_effect; //案件效果一级
            var effectTo = dictData.dic_dic_case_effect_to; //案件效果二级

            var dicAppeal = dictData.dic_dic_appeal; //上诉情况
            var dicAppealForm = dictData.dic_dic_appeal_form; //代写上诉状

            //1级的select
            that.result.writOptions = dicClosingDoc; //结案文书
            that.result.appealOptions = dicAppeal; //上诉情况
            that.result.ghostwriteOptions = dicAppealForm; //代写上诉状

            //结案方式
            var methodList = method;
            var methodToList = methodTo;
            for (let i = 0; i < methodToList.length; i++) {
                var parent = methodToList[i].code.split('_')[0];
                for (let f = 0; f < methodList.length; f++) {
                    if (!methodList[f].children) {
                        methodList[f].children = [];
                    }
                    if (methodList[f].code == parent) {
                        methodList[f].children.push(methodToList[i]);
                    }
                }
            }
            that.result.wayOptions = methodList;

            //案件效果
            var effectList = effect;
            var effectToList = effectTo;
            // console.log(effectList)
            for (let i = 0; i < effectToList.length; i++) {
                var parent = effectToList[i].code.split('_')[0];
                for (let f = 0; f < effectList.length; f++) {
                    if (!effectList[f].children) {
                        effectList[f].children = [];
                    }
                    if (effectList[f].code == parent) {
                        effectList[f].children.push(effectToList[i]);
                    }
                }
            }
            // console.log(effectList)
            that.result.effectOptions = effectList;
            // console.log(effectList);
            // console.log(method);
            // console.log(methodTo);
            // console.log(effect);
            // console.log(effectTo);
        },
        //提交
        subCase: function(type) {
            var that = this;
            var ajax = new AJAX();
            var subUndertakeObj = {};
            var ui = new UI();
            var summary = that.result.summary;
            summary = summary == null ? '' : summary;

            if (summary == '') {
                ui.message({
                    message: '请填写办案小结',
                    type: 'error'
                });
                return false
            } else if (summary.length > 2000) {
                ui.message({
                    message: '办案小结最多2000字符',
                    type: 'error'
                });
                return false
            }

            //组装undertake
            var undertake = that.undertake;
            for (let key in undertake) {
                for (let sKey in undertake[key]) {
                    if (undertake[key][sKey] != "" && sKey != 'options' && sKey != 'selectValue') {
                        subUndertakeObj[sKey] = undertake[key][sKey];
                    }
                }
            }
            // console.log('===================组装undertake后');
            // console.log(subUndertakeObj);

            //组装result
            var result = that.result;
            for (let key in result) {
                if (result[key] != "" && key.indexOf('Options') == -1) {
                    if (key == 'wayValue') {
                        subUndertakeObj.dicClosingMethod = result[key][0];
                        subUndertakeObj.dicClosingMethodTo = result[key][1];
                    } else if (key == 'effectValue') {
                        subUndertakeObj.dicCaseEffect = result[key][0];
                        subUndertakeObj.dicCaseEffectTo = result[key][1];
                    } else {
                        // console.log(result[key]);
                        subUndertakeObj[key] = result[key];
                    }
                }
            }
            // console.log('===================组装result后');
            // console.log(subUndertakeObj);

            // 组装案件承办 文件列表 resources
            const resources = [...that.resources];
            for (let i = 0; i < resources.length; i++) {
                if (resources[i].fileList == undefined) {
                    resources[i].fileList = [];
                }
                for (let f = 0; f < resources[i].fileList.length; f++) {
                    if (resources[i].fileList[f].isDelete != undefined) {
                        delete resources[i].fileList[f];
                    } else {
                        var oldObj = resources[i].fileList[f];
                        var newObj = {
                            addUrl: oldObj.url,
                            dicFileType: '4',
                            fileName: oldObj.name,
                            objectKey: oldObj.key
                        }
                        resources[i].fileList[f] = newObj;
                    }
                }
                var newArr = resources[i].undertakeResources;
                resources[i].undertakeResources = newArr.concat(resources[i].fileList);
                delete resources[i].fileList;
            }

            subUndertakeObj.resources = resources;

            // console.log('===================组装resources后');
            // console.log(that.resources);
            subUndertakeObj.jsonArr = 'resources';
            subUndertakeObj.tCaseId = that.caseId;

            // console.log(subUndertakeObj);

            if (type == '2') {
                // console.log('提交')
                subUndertakeObj.dicStatus = '2';
                ajax.post(ajax.api.COMMITCASE, subUndertakeObj, function(data) {
                    that.$router.go(-1);
                });
            } else {
                // console.log('保存')
                subUndertakeObj.dicStatus = that.dicStatus == null || that.dicStatus == '' || that.dicStatus == undefined ? '1' : that.dicStatus;
                ajax.post(ajax.api.SAVECASE, subUndertakeObj, function(data) {
                    // that.$router.go(-1);
                    ui.message({
                        message: '保存成功',
                        type: 'success'
                    });
                    setTimeout(function() {
                        history.go(0);
                    }, 2000);

                    // console.log(data);
                });
            }
        },
        //获取案件承办信息
        getUndertakeCaseResult: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    caseId: that.caseId,
                };
            ajax.get(ajax.api.UNDERTAKECASERESULT, _data, function(data) {
                // console.log(data);
                var resData = data.data;
                // 保存文件列表
                var resources = resData.resources;
                for (let i = 0; i < resources.length; i++) {
                    for (let f = 0; f < that.resources.length; f++) {
                        if (resources[i].dicCategory == that.resources[f].dicCategory) {
                            // console.log('有文件')
                            // console.log(resources[i]);
                            that.resources[f] = resources[i];
                            that.resources[f].fileList = [];
                            // console.log(that.resources);
                        }
                    }
                }

                for (let i = 0; i < that.resources.length; i++) {
                    if (that.resources[i].undertakeResources.length != 0) {
                        var fileListArr = [];
                        for (let f = 0; f < that.resources[i].undertakeResources.length; f++) {
                            var undertakeResources = that.resources[i].undertakeResources[f];
                            var obj = {};
                            for (let key in undertakeResources) {
                                var fileListKey;
                                switch (key) {
                                    case 'tempUrl':
                                        fileListKey = 'url'
                                        break;
                                    case 'fileId':
                                        fileListKey = 'uid'
                                        break;
                                    case 'fileName':
                                        fileListKey = 'name'
                                        break;
                                    case 'objectKey':
                                        fileListKey = 'key'
                                        break;
                                    default:
                                        fileListKey = key;
                                }
                                obj[fileListKey] = undertakeResources[key];
                            }
                            fileListArr.push(obj);
                        }
                        that.resources[i].fileList = fileListArr;
                    }
                }

                // console.log('=============组合后的resources=============');
                // console.log(that.resources);
                // that.dicStatus = Number(data.data.dicStatus);
                // that.result = data.data;

                that.result.handlingOrg = resData.handlingOrg;
                that.result.dicClosingDoc = resData.dicClosingDoc;
                that.result.docNumber = resData.docNumber;

                //案件办理结果
                that.result.wayValue[0] = resData.dicClosingMethod;
                that.result.wayValue[1] = resData.dicClosingMethodTo;
                that.result.effectValue[0] = resData.dicCaseEffect;
                that.result.effectValue[1] = resData.dicCaseEffectTo;
                that.result.dicAppeal = resData.dicAppeal;
                that.result.dicAppealForm = resData.dicAppealForm;
                that.result.saveLosses = resData.saveLosses;
                that.result.summary = resData.summary;
                that.result.pleasePay = resData.pleasePay;

                //案件承办
                that.undertake.procedure.dicHandle = resData.dicHandle;
                that.undertake.procedure.handledTime = resData.handledTime;
                that.undertake.procedure.unhandledReason = resData.unhandledReason;

                that.undertake.record.dicTranscript = resData.dicTranscript;
                that.undertake.record.transcriptTime = resData.transcriptTime;
                that.undertake.record.untranscriptReason = resData.untranscriptReason;

                that.undertake.read.dicMarking = resData.dicMarking;
                that.undertake.read.markingTime = resData.markingTime;
                that.undertake.read.unmarkingReason = resData.unmarkingReason;

                that.undertake.meet.dicMeet = resData.dicMeet;
                that.undertake.meet.meetTime = resData.meetTime;
                that.undertake.meet.unmeetReason = resData.unmeetReason;

                that.undertake.meetRecord.dicMeetRecord = resData.dicMeetRecord;
                that.undertake.meetRecord.meetRecordTime = resData.meetRecordTime;
                that.undertake.meetRecord.unmeetRecordReason = resData.unmeetRecordReason;

                that.undertake.obtainEvidence.dicEvidence = resData.dicEvidence;
                if (resData.evidenceTime) {
                    if(!isNaN(resData.evidenceTime)){
                        resData.evidenceTime = Number(resData.evidenceTime);
                    }
                    resData.evidenceTime = new Date(resData.evidenceTime) * 1;
                }
                that.undertake.obtainEvidence.evidenceTime = resData.evidenceTime;
                that.undertake.obtainEvidence.unevidenceReason = resData.unevidenceReason;

                that.undertake.session.dicSession = resData.dicSession;
                that.undertake.session.sessionTime = resData.sessionTime;
                that.undertake.session.unsessionReason = resData.unsessionReason;

                that.undertake.notification.dicBanjie = resData.dicBanjie;
                that.undertake.notification.banjieTime = resData.banjieTime;
                that.undertake.notification.unbanjieReason = resData.unbanjieReason;
                that.dicStatus = resData.dicStatus;

                setTimeout(function() {
                    that.loading = false;
                }, 500)
            });
        },
        //判断案件状态
        caseStatus: function(caseType) {
            // caseType参数说明
            // 1、dicCaseType 案件类别（民事、刑事、行政）【查字典】
            // 2、dicOriginChannaelType 来源渠道类型(1通知类 2申请类 3商请类)【查字典】
            // 3、dicLawStatus 法律状态（民事-劳动仲裁）【查字典】
            var that = this;
            var dictData = that.dictData;
            var dicCaseTypeList = dictData.dic_case_type,
                dicOriginChannaelTypeList = dictData.dic_case_orign_type,
                dicLawStatusList = dictData.dic_legal_status;

            // console.log(caseType)
            // console.log(dicCaseTypeList);
            // console.log(dicOriginChannaelTypeList);
            // console.log(dicLawStatusList);

            var statusObj = {};
            for (let key in dicCaseTypeList) {
                if (dicCaseTypeList[key].code == caseType.dicCaseType) {
                    statusObj.dicCaseType = dicCaseTypeList[key].name;
                    break;
                }
            }
            for (let key in dicOriginChannaelTypeList) {
                if (dicOriginChannaelTypeList[key].code == caseType.dicOriginChannaelType) {
                    statusObj.dicOriginChannaelType = dicOriginChannaelTypeList[key].name;
                    break;
                }
            }
            for (let key in dicLawStatusList) {
                if (dicLawStatusList[key].code == caseType.dicLawStatus) {
                    statusObj.dicLawStatus = dicLawStatusList[key].name;
                    break;
                }
            }
            // console.log('===================');
            // console.log(statusObj);
            // {dicCaseType:"民事案件",dicLawStatus:"劳动仲裁",dicOriginChannaelType:"通知类"}
            // 民事案件:1
            // 民事案件-劳动仲裁:2
            // 行政案件:3
            // 刑事案件-申请-援助方式：代理:4
            // 刑事案件-申请-援助方式：非代理:5
            // 刑事案件-通知|商请-援助方式：代理:6
            // 刑事案件-通知|商请-援助方式：非代理:7

            var _caseType;
            if (statusObj.dicCaseType == '民事案件') {
                if (statusObj.dicLawStatus == '劳动仲裁') {
                    _caseType = '2';
                } else {
                    _caseType = '1';
                }
            } else if (statusObj.dicCaseType == '行政案件') {
                _caseType = '3';
            } else if (statusObj.dicCaseType == '刑事案件') {
                if (statusObj.dicOriginChannaelType == '申请类') {
                    if (caseType.aidWay.indexOf('代理') != -1) {
                        _caseType = '4';
                    } else {
                        _caseType = '5';
                    }
                } else {
                    if (caseType.aidWay.indexOf('代理') != -1) {
                        _caseType = '6';
                    } else {
                        _caseType = '7';
                    }
                }
            } else {
                console.log('出错了');
            }
            // _caseType = '4';
            // console.log(_caseType);
            var effectList = [...that.result.effectOptions];
            if (_caseType == '1' || _caseType == '2' || _caseType == '3') {
                delete effectList[2];
            } else {
                delete effectList[0];
                delete effectList[1];
            }
            that.result.effectOptions = effectList;

            // 结案文书选项筛选
            // console.log(that.result.writOptions);
            var writOptions = [...that.result.writOptions];
            var newWritOptions = [];

            for (let i = 0; i < writOptions.length; i++) {
                var _name = writOptions[i].name;
                if (_caseType == '1' || _caseType == '2') {
                    if (_name == '法院调解书' || _name == '劳动仲裁机构不予受理通知书' || _name == '劳动仲裁调解书' || _name == '劳动仲裁裁决书' || _name == '听证单位处理文书' || _name == '公证文书' || _name == '司法鉴定文书' || _name == '申诉（再审）审查裁定文书' || _name == '民事裁定书' || _name == '民事判决书' || _name == '人民调解书') {
                        newWritOptions.push(writOptions[i])
                    }
                } else if (_caseType == '3') {
                    if (_name == '行政复议文书' || _name == '行政裁定书' || _name == '行政判决书') {
                        newWritOptions.push(writOptions[i])
                    }
                } else if (_caseType == '4' || _caseType == '5' || _caseType == '6' || _caseType == '7') {
                    if (_name == '撤销案件决定书' || _name == '起诉意见书' || _name == '不起诉决定书' || _name == '起诉书' || _name == '刑事裁定书' || _name == '刑事判决书') {
                        newWritOptions.push(writOptions[i])
                    }
                } else {
                    newWritOptions = writOptions;
                }
            }
            that.result.writOptions = newWritOptions;
            // console.log(newWritOptions);



            //其他承办材料列表
            var materialsOptions = [];
            switch (_caseType) {
                case '1':
                    materialsOptions = [
                        { value: 'msqszFileList', label: '民事起诉状或答辩状、上诉状' },
                        { value: 'hjxyFileList', label: '和解协议书' },
                        { value: 'rmtjsFileList', label: '人民调解书' },
                        { value: 'shsFileList', label: '申诉书或再审申请书' },
                        { value: 'othersFileList', label: '其他材料' },
                    ];
                    break;
                case '2':
                    materialsOptions = [
                        { value: 'ldzcszsFileList', label: '劳动仲裁申请书' },
                        { value: 'othersFileList', label: '其他材料' },
                    ];
                    break;
                case '3':
                    materialsOptions = [
                        { value: 'othersFileList', label: '其他材料' },
                    ];
                    break;
                default:
                    materialsOptions = [
                        { value: 'xsdlyjsFileList', label: '刑事辩护（代理）意见书' },
                        { value: 'xsfdmsszFileList', label: '刑事附带民事诉状' },
                        { value: 'othersFileList', label: '其他材料' },
                    ];
            }


            that.caseType = _caseType;
            that.undertake.materials.options = materialsOptions;
            // that.undertake.materials.selectValue = materialsOptions[0].value;
            // console.log('============'+ _caseType +'其他材料的options================');
            // console.log(that.undertake.materials.options);
        },
        //上传成功的回调
        getImgUrl(response, file, fileList) {
            // console.log('==================第一个上传==================')
            // console.log(response);
            // console.log(this.resources[0])
            // console.log(this.resources[0].undertakeResources)
            var that = this,
                ajax = new AJAX();
            if (response.name) {
                // console.log(response)
                // console.log('承办案件')
                var _data = {
                    key: response.fileUrl
                }
                ajax.get(ajax.api.GETOSSURL, _data, function(data) {
                    // console.log(data);
                    var fileObj = {
                        name: response.fileName,
                        url: data.data.url,
                        key: response.fileUrl
                    };
                    for (let i = 0; i < that.resources.length; i++) {
                        if (that.resources[i].dicCategory == response.name) {
                            if (!that.resources[i].fileList) {
                                that.resources[i].fileList = [];
                            }
                            // console.log('======添加前=====')
                            // console.log(that.resources[i].fileList)
                            that.resources[i].fileList.push(fileObj);
                            // console.log('======添加后=====')
                            // console.log(that.resources[i].fileList)
                        }
                    }
                });
            } else {
                // console.log('文书类材料')
                // console.log(response.id)
                var _data = {
                    name: response.fileName,
                    objectKey: response.fileUrl,
                    tCaseMaterialStorageId: response.id
                }
                ajax.post(ajax.api.UPDATEFILESTORAGEMES, _data, function(data) {
                    // console.log(data);
                    var _name = response.fileName,
                        _url = data.data.addrUrl,
                        id = response.id;
                    // console.log('绑定图片成功');
                    // console.log('图片url：');
                    // console.log(_url);
                    // console.log('图片名称：');
                    // console.log(_name);
                    var materialDocs = that.materialDocs;
                    for (let i = 0; i < materialDocs.length; i++) {
                        if (materialDocs[i].tCaseMaterialStorageId == id) {
                            materialDocs[i].addrUrl = _url;
                            materialDocs[i].name = _name;
                        }
                    }
                    that.materialDocs = materialDocs;
                });
            }
        },
        offTc() {
            this.tcShow = false;
        },
        //打开案件承办里上传的文件
        openPngUrl(file) {
            // console.log(file);
            // window.open(file.url);
            this.tcUrl = file.url;
            this.tcShow = true;
        },
        //打开文件url
        openHtml: function(url) {
            this.tcUrl = url;
            this.tcShow = true;
        },
        //案件详情
        getCaseDetai: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    caseId: that.caseId,
                    tHpUserId: getLs('userInfo').userId
                };
            // console.log(_data)
            ajax.get(ajax.api.CASEDETAIL, _data, function(data) {
                var caseData = data.data;
                that.caseDetail = caseData;
                // console.log(caseData);
                var caseStatusObj = {
                    dicCaseType: caseData.dicCaseType,
                    dicOriginChannaelType: caseData.dicOriginChannaelType,
                    dicLawStatus: caseData.dicLawStatus,
                    aidWay: caseData.aidWay
                }
                that.caseStatus(caseStatusObj);

                var dicCaseStatus = Number(caseData.dicCaseStatus);
                that.dicCaseStatus = dicCaseStatus;
                // console.log(dicCaseStatus);
                if (that.isChange != 0 || dicCaseStatus == 16 || dicCaseStatus > 17 || dicCaseStatus == 0) {
                    that.isEdit = false; //不可编辑
                } else {
                    that.isEdit = true; //可以编辑
                }

                if (that.isChange != 0 || dicCaseStatus > 17 || dicCaseStatus == 0) {
                    that.isSave = false; //不可保存
                } else {
                    that.isSave = true; //可以保存
                }


                // 1、dicCaseType 案件类别（民事、刑事、行政）【查字典】
                // 2、dicOriginChannaelType 来源渠道类型(1通知类 2申请类 3商请类)【查字典】
                // 3、dicLawStatus 法律状态（民事-劳动仲裁）【查字典】
            });
        },
        //文书类材料
        getMaterialDocs: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    tCaseId: that.caseId
                };
            ajax.get(ajax.api.MATERIALDOCS, _data, function(data) {
                // console.log(data);
                that.materialDocs = data.data;
            })
        },
        //事项日志
        getCaseProgressLog: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    caseId: that.caseId
                };
            ajax.get(ajax.api.CASEPROGRESSLOG, _data, function(data) {
                // console.log(data);
                var logList = [];
                for (let i = data.data.length - 1; i >= 0; i--) {
                    data.data[i].createTime = sdate(data.data[i].createTime)
                    logList.push(data.data[i]);
                }
                that.caseProgressLog = logList;
            })
        },
    }
}
</script>
<style lang="less">
.myCase {
    .tc {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 9999;
        background: #000;
        text-align: center;
        img {
            width: 100%;
        }
        button {
            position: absolute;
            bottom: 15px;
            left: 50%;
            margin-left: -35px;
        }
    }
    .el-input-group__prepend {
        border: none;
        color: #000;
        padding: 0;
        text-indent: 7px;
        font-size: 1.5rem;
        width: 70px;
        background: none;
    }
    .el-steps {
        margin: 10px 0;
    }
    .el-upload-list {
        display: none;
        margin-bottom: 5px;
        .el-upload-list__item-name {
            text-align: left;
            padding: 0;
        }
    }
    .el-upload-list {
        .el-upload-list__item {
            float: left;
            line-height: 30px;
        }
        .el-upload-list__item:last-child {
            margin-bottom: 10px;
        }
    }
    .el-upload-list__item.is-success .el-upload-list__item-status-label {
        position: relative;
        right: 0;
        float: left;
        display: block;
    }
    .el-upload-list__item .el-icon-close {
        display: block;
        font-size: 1.6rem;
    }
    .el-upload-list__item .el-icon-close:before {
        content: "删除";
    }
    .el-upload-list__item-name {
        float: left;
        width: 70%;
        margin: 0;
    }
    .undertake .el-upload-list {
        display: block;
    }
    >p .el-button {
        width: 90%;
        margin: 10px 5%;
    }
    .el-input-group__append {
        border: none;
        border-radius: 0;
    }
    .el-cascader {
        width: 150px;
    }
    .information {
        width: 100%;
        background: #fff;
        margin-bottom: 10px;
        border-bottom: solid 1px #c7c7cc;
        border-top: solid 1px #c7c7cc;
        padding-bottom: 10px;
        dt {
            width: 100%;
            border-bottom: solid 1px #c7c7cc;
            text-indent: 10px;
            font-size: 1.5rem;
            line-height: 40px;
            margin-bottom: 10px;
        }
        dd {
            width: 95%;
            margin-right: 5%;
            position: relative;
            line-height: 30px;
            span {
                color: #8c8c8c;
                display: inline-block;
                width: 30%;
                text-align: right;
                vertical-align: top;
            }
            b {
                display: inline-block;
                font-weight: normal;
                width: 65%;
            }
        }
    }
    .tabs {
        border-top: solid 1px #c7c7cc;
        border-bottom: solid 1px #c7c7cc;
        .tabsContent {
            width: 90%;
            margin: 0 5%;
            padding: 20px 0;
            .el-step__title {
                font-size: 1.4rem;
                color: #000;
            }
            .el-step__description {
                font-size: 1.4rem;
                color: #000;
                margin-bottom: 30px;
            }
            .upload {
                float: right;
            }
        }
        .materialsList {
            line-height: 32px;
            .el-row {
                margin-bottom: 5px;
            }
        }
        .last {
            border-bottom: solid 1px #c7c7cc;
            .el-collapse-item__wrap,
            .el-collapse-item__header {
                border: none;
            }
        }
        .el-tab-pane {
            background: #fff;
        }
        .el-tabs__header {
            margin: 0;
            background: #fff;
            .el-tabs__item {
                font-size: 1.5rem;
            }
        }
        .el-tabs__nav-wrap {
            padding: 0 5%;
        }
        .el-collapse {
            border: none;
        }
        .el-collapse-item {
            width: 90%;
            padding: 0 5%;
        }
        .el-collapse-item:last-child .el-collapse-item__header {
            border: none;
        }

        dl {
            dd {
                width: 95%;
                margin-left: 5%;
                line-height: 40px;
                position: relative;
                .el-col-8 {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .el-col-16 {
                    position: relative;
                    z-index: 1;
                    text-align: right;
                    width: 100%;
                }
                .materials {
                    .el-select {
                        width: 75%;
                        input[type=text] {
                            width: 100%;
                        }
                    }
                }
                input[type=text] {
                    line-height: 40px;
                    height: 40px;
                    border: none;
                    text-align: right;
                    width: 100px;
                }
                >input[type=text] {
                    width: 100%;
                    text-align: left;
                }
                .el-date-editor {
                    width: 125px;
                    input[type=text] {
                        padding-right: 0;
                        width: 100%;
                        text-align: center;
                    }
                }
            }
        }
        .result {
            width: 100%;
            border-top: solid 10px #f7f7f7;
            .el-col-8 {
                text-indent: 7px;
            }
            dt {
                width: 100%;
                border-bottom: solid 1px #c7c7cc;
                border-top: solid 1px #c7c7cc;
                text-indent: 10px;
                font-size: 1.5rem;
                line-height: 40px;
            }
            dd {
                width: 90%;
                margin: 0 5%;
                border-bottom: solid 1px #c7c7cc;
                font-size: 1.5rem;
                line-height: 40px;
                input[type=text] {
                    line-height: 40px;
                    height: 40px;
                    border: none;
                    text-align: right;
                    width: 100px;
                }
                .el-input input {
                    width: 100%;
                    text-align: left;
                }
                .el-col-16 .el-select {
                    width: 75%;
                    text-align: right;
                }
                .el-col-16 .el-cascader {
                    width: 75%;
                    text-align: right;
                    .el-cascader__label {
                        text-align: right;
                        padding-right: 30px;
                    }
                }
                .el-col-16 .el-select input,
                .el-col-16 .el-cascader input {
                    width: 90%;
                    text-align: right;
                    padding-left: 0;
                }

                textarea {
                    width: 98%;
                    height: 150px;
                    border: solid 1px #c7c7cc;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }
            }
            dd:last-child {
                border: none;
            }
        }
    }
    .submitCase {
        width: 90%;
        margin: 10px 5%;
    }
    .check {
        color: #606266;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-color: #ebeef5;
        padding: 0 15px;
        font-size: 12px;
        border-radius: 3px;
        display: inline-block;
    }
}
</style>