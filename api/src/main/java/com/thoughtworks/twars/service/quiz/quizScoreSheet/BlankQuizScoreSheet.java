package com.thoughtworks.twars.service.quiz.quizScoreSheet;

import com.thoughtworks.twars.bean.BlankQuizSubmit;
import com.thoughtworks.twars.bean.ItemPost;
import com.thoughtworks.twars.mapper.BlankQuizSubmitMapper;
import com.thoughtworks.twars.mapper.ItemPostMapper;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BlankQuizScoreSheet implements IQuizScoreSheet {
    @Inject
    private BlankQuizSubmitMapper blankQuizSubmitMapper;

    @Inject
    private ItemPostMapper itemPostMapper;

//    @Inject
//    private BlankQuizSubmit blankQuizSubmitObj;

//    @Inject
//    private ItemPost itemPostObj;

    public void setBlankQuizSubmitMapper(BlankQuizSubmitMapper blankQuizSubmitMapper) {
        this.blankQuizSubmitMapper = blankQuizSubmitMapper;
    }

    public void setItemPostMapper(ItemPostMapper itemPostMapper) {
        this.itemPostMapper = itemPostMapper;
    }

    @Override
    public List<Map> getQuizScoreSheet(int scoreSheetId) {
        return blankQuizSubmitMapper.findByScoreSheetId(scoreSheetId)
                .stream()
                .map(blankQuizSubmit -> {
                    Map<String, Object> blankQuizUri = new HashMap<>();
                    blankQuizUri.put("uri", "/blankQuiz/" + blankQuizSubmit.getBlankQuizId());
                    Map<String, Object> blankQuizSubmitUri = new HashMap<>();
                    blankQuizSubmitUri.put("blankQuiz", blankQuizUri);
                    blankQuizSubmitUri.put("itemPosts",
                            getByBlankQuizSubmitId(blankQuizSubmit.getBlankQuizId()));
                    return blankQuizSubmitUri;
                })
                .collect(Collectors.toList());

    }

    public List<Map> getByBlankQuizSubmitId(int blankQuizSubmitId) {
        return itemPostMapper.findByBlankQuizSubmit(blankQuizSubmitId)
                .stream()
                .map(itemPost -> {
                    Map<String, Object> itemPostUri = new HashMap<>();
                    Map<String, Object> quizItemUri = new HashMap<>();
                    quizItemUri.put("uri", "quizItem/" + itemPost.getQuizItemId());
                    itemPostUri.put("answer", itemPost.getAnswer());
                    itemPostUri.put("quizItem", quizItemUri);
                    return itemPostUri;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void insertQuizScoreSheet(Map data, int scoreSheetId) {
        int blankQuizId;
        int quizItemId;
        String answer;

        List<Map> blankQuizSubmits = (List) data.get("blankQuizSubmits");

        for (int j = 0; j < blankQuizSubmits.size(); j++) {
            blankQuizId = (int) blankQuizSubmits.get(j).get("blankQuizId");

            BlankQuizSubmit blankQuizSubmitObj = new BlankQuizSubmit();
            blankQuizSubmitObj.setBlankQuizId(blankQuizId);
            blankQuizSubmitObj.setScoreSheetId(scoreSheetId);

            blankQuizSubmitMapper.insertBlankQuizSubmit(blankQuizSubmitObj);

            List<Map> itemPosts = (List) blankQuizSubmits.get(j)
                    .get("itemPosts");
            for (int i = 0; i < itemPosts.size(); i++) {
                Map itemPost = itemPosts.get(i);
                answer = (String) itemPost.get("answer");
                quizItemId = (Integer) itemPost.get("quizItemId");

                ItemPost itemPostObj = new ItemPost();
                itemPostObj.setAnswer(answer);
                itemPostObj.setQuizItemId(quizItemId);
                itemPostObj.setBlankQuizSubmitsId(blankQuizSubmitObj.getId());

                itemPostMapper.insertItemPost(itemPostObj);
            }
        }
    }
}
